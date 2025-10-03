import type { Account, AuthOptions, OauthAccount, Session } from './types'
import Cookies from './cookies'
import {
  encodeHex,
  generateSecureString,
  generateStateOrCode,
  hashSecret,
} from './crypto'
import { Password } from './password'

export function Auth(opts: AuthOptions) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...opts,
    cookieKeys: { ...DEFAULT_OPTIONS.cookieKeys, ...opts.cookieKeys },
    cookieOptions: { ...DEFAULT_OPTIONS.cookieOptions, ...opts.cookieOptions },
  } satisfies Required<AuthOptions>

  const { adapter, cookieKeys, cookieOptions, providers, session } = options

  async function createSession(
    userId: string,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<Session> {
    const token = generateSecureString()
    const hashToken = await hashSecret(token)
    const expires = new Date(Date.now() + session.expiresIn * 1000)

    await adapter.createSession({
      token: encodeHex(hashToken),
      expires,
      userId,
      ipAddress,
      userAgent,
    })

    return { token, userId, expires, ipAddress, userAgent }
  }

  async function auth(opts: { headers: Headers }) {
    const cookies = new Cookies(opts as Request)
    const token = cookies.get(cookieKeys.token) ?? ''

    const hashToken = encodeHex(await hashSecret(token))

    try {
      const result = await adapter.getSessionAndUser(hashToken)
      if (!result) return { user: null, expires: new Date() }

      const now = Date.now()
      const expiresTime = result.expires.getTime()

      if (now > expiresTime) {
        await adapter.deleteSession(hashToken)
        return { user: null, expires: new Date() }
      }

      if (now >= expiresTime - session.expiresThreshold * 1000) {
        const newExpires = new Date(now + session.expiresIn * 1000)
        await adapter.updateSession(hashToken, { expires: newExpires })
        result.expires = newExpires
      }

      return result
    } catch {
      return { user: null, expires: new Date() }
    }
  }

  async function signIn(
    opts: { identifier: string; password: string },
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<Session> {
    const { identifier, password } = opts

    const user = await adapter.getUserByEmailOrUsername(identifier)
    if (!user) throw new Error('Invalid credentials')

    const account = await adapter.getAccount('credentials', user.id)
    if (!account?.password) throw new Error('Invalid credentials')

    const isValid = await Password.verify(account.password, password)
    if (!isValid) throw new Error('Invalid credentials')

    return createSession(user.id, ipAddress, userAgent)
  }

  async function signOut(opts: { headers: Headers }): Promise<void> {
    const cookies = new Cookies(opts as Request)
    const token = cookies.get(cookieKeys.token) ?? ''

    const hashToken = encodeHex(await hashSecret(token))
    await adapter.deleteSession(hashToken)
  }

  async function getOrCreateUser(
    opts: Omit<OauthAccount & Account, 'userId'>,
    ipAddress: string | null,
    userAgent: string | null,
  ): Promise<Session> {
    const { provider, accountId, ...userData } = opts
    const existingAccount = await adapter.getAccount(provider, accountId)
    if (existingAccount)
      return createSession(existingAccount.userId, ipAddress, userAgent)

    const existingUser = await adapter.getUserByEmailOrUsername(userData.email)
    const userId =
      existingUser?.id ?? (await adapter.createUser(userData))?.id ?? ''
    if (!userId) throw new Error('Failed to create user')

    await adapter.createAccount({
      provider,
      accountId,
      userId,
      password: null,
    })
    return createSession(userId, ipAddress, userAgent)
  }

  return {
    auth,
    signIn,
    signOut,
    handlers: {
      GET: async (request: Request) => {
        const { pathname, searchParams } = new URL(request.url)
        const cookies = new Cookies(request)

        try {
          /**
           * [GET] /api/auth/get-session: Get current session
           */
          if (pathname === '/api/auth/get-session') {
            const session = await auth(request)
            return setCorsHeaders(Response.json(session))
          }

          /**
           * [GET] /api/auth/:provider: Start OAuth flow
           */
          const oauthMatch = /^\/api\/auth\/([^/]+)$/.exec(pathname)
          if (oauthMatch) {
            const [, provider = ''] = oauthMatch
            const instance = providers[provider]
            if (!instance) throw new Error(`Provider ${provider} not found`)

            const state = generateStateOrCode()
            const codeVerifier = generateStateOrCode()
            const redirectUrl = searchParams.get('redirect_to') ?? '/'

            const callbackUrl = await instance.createAuthorizationUrl(
              state,
              codeVerifier,
            )
            const response = new Response(null, {
              status: 302,
              headers: { Location: callbackUrl.toString() },
            })

            const opts = { Path: '/', MaxAge: 60 * 5 }
            cookies.set(response, cookieKeys.state, state, opts)
            cookies.set(response, cookieKeys.code, codeVerifier, opts)
            cookies.set(response, cookieKeys.redirect, redirectUrl, opts)
            return setCorsHeaders(response)
          }

          /**
           * [GET] /api/auth/callback/:provider: Handle OAuth callback
           */
          const callbackMatch = /^\/api\/auth\/callback\/([^/]+)$/.exec(
            pathname,
          )
          if (callbackMatch) {
            const [, provider = ''] = callbackMatch
            const instance = options.providers[provider]
            if (!instance) throw new Error(`Provider ${provider} not found`)

            const code = searchParams.get('code') ?? ''
            const state = searchParams.get('state') ?? ''
            const storedState = cookies.get(cookieKeys.state) ?? ''
            const codeVerifier = cookies.get(cookieKeys.code) ?? ''
            const redirectTo = cookies.get(cookieKeys.redirect) ?? '/'
            if (state !== storedState || !code || !codeVerifier)
              throw new Error('Invalid state or code')

            const userData = await instance.fetchUserData(code, codeVerifier)
            const ipAddress = request.headers.get('x-forwarded-for') ?? null
            const userAgent = request.headers.get('user-agent') ?? null
            const session = await getOrCreateUser(
              { ...userData, provider, password: null },
              ipAddress,
              userAgent,
            )

            const Location = new URL(redirectTo, request.url).toString()
            const response = new Response(null, {
              status: 302,
              headers: { Location },
            })
            for (const key of Object.values(cookieKeys))
              cookies.delete(response, key)
            cookies.set(response, cookieKeys.token, session.token, {
              ...cookieOptions,
              expires: session.expires,
            })
            return setCorsHeaders(response)
          }

          return setCorsHeaders(new Response('Not Found', { status: 404 }))
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Internal Server Error'
          return setCorsHeaders(new Response(message, { status: 500 }))
        }
      },
      POST: async (request: Request) => {
        const cookies = new Cookies(request)
        const { pathname } = new URL(request.url)

        try {
          /**
           * [POST] /api/auth/sign-in: Sign in with email and password
           */
          if (pathname === '/api/auth/sign-in') {
            const body = (await request.json()) as Parameters<typeof signIn>[0]
            if (!body.identifier || !body.password)
              throw new Error('Invalid credentials')

            const ipAddress = request.headers.get('x-forwarded-for') ?? null
            const userAgent = request.headers.get('user-agent') ?? null
            const result = await signIn(body, ipAddress, userAgent)

            const response = Response.json(result)
            cookies.set(response, cookieKeys.token, result.token, {
              ...cookieOptions,
              expires: result.expires,
            })
            return setCorsHeaders(response)
          }

          /**
           * [POST] /api/auth/sign-out: Sign out current session
           */
          if (pathname === '/api/auth/sign-out') {
            await signOut(request)
            const response = Response.json({
              message: 'Signed out successfully',
            })
            cookies.delete(response, cookieKeys.token)
            return setCorsHeaders(response)
          }

          return setCorsHeaders(new Response('Not Found', { status: 404 }))
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Internal Server Error'
          return setCorsHeaders(new Response(message, { status: 500 }))
        }
      },
    },
  }
}

function setCorsHeaders(response: Response): Response {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Request-Method', '*')
  response.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  response.headers.set('Access-Control-Allow-Headers', '*')
  return response
}

const DEFAULT_OPTIONS = {
  cookieKeys: {
    token: 'auth.token',
    state: 'auth.state',
    code: 'auth.code',
    redirect: 'auth.redirect',
  },
  cookieOptions: {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  },
} as const satisfies Omit<
  Required<AuthOptions>,
  'adapter' | 'providers' | 'session'
>
