import type { AuthValidator } from '@yukinu/validators/auth'
import { env } from '@yukinu/validators/env'

import type { AuthOptions, NewAccount, OauthAccount, Session } from '@/types'
import Cookies from '@/core/cookies'
import {
  encodeHex,
  generateSecureString,
  generateStateOrCode,
  hashSecret,
} from '@/core/crypto'
import { Password } from '@/core/password'
import { TokenBucketRateLimit } from '@/rate-limit'

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
    headers: Headers = new Headers(),
  ): Promise<Omit<Session, 'user'>> {
    const token = generateSecureString()
    const hashToken = await hashSecret(token)
    const expires = new Date(Date.now() + session.expiresIn * 1000)

    const userAgent = headers.get('user-agent') ?? ''
    const ipAddress = headers.get('x-forwarded-for') ?? ''

    const sessionData = { token, userAgent, ipAddress, userId, expires }
    await adapter.createSession({
      ...sessionData,
      token: encodeHex(hashToken),
      userId,
    })

    return sessionData
  }

  async function auth(opts: { headers: Headers }) {
    const cookies = new Cookies(opts as Request)
    const token = cookies.get(cookieKeys.token) ?? ''

    const hashToken = encodeHex(await hashSecret(token))

    try {
      const result = await adapter.getSessionAndUser(hashToken)
      if (!result) throw new Error('Session not found')

      const now = Date.now()
      const expiresTime = result.expires.getTime()
      const userAgent = opts.headers.get('user-agent') ?? ''
      /*
       * disable ip check for now due to react router dont have ip info in header
       * const ipAddress =
       *  opts.headers.get('x-forwarded-for') ??
       * opts.headers.get('x-real-ip') ?? ''
       */

      if (
        now > expiresTime ||
        result.userAgent !== userAgent
        // result.ipAddress !== ipAddress
      ) {
        await adapter.deleteSession(hashToken)
        throw new Error('Session expired')
      }

      if (now >= expiresTime - session.expiresThreshold * 1000) {
        const newExpires = new Date(now + session.expiresIn * 1000)
        await adapter.updateSession(hashToken, { expires: newExpires })
        result.expires = newExpires
      }

      return result
    } catch {
      return { user: null, userAgent: '', ipAddress: '', expires: new Date(0) }
    }
  }

  async function signIn(
    opts: { identifier: string; password: string },
    headers: Headers = new Headers(),
  ): Promise<Omit<Session, 'user'>> {
    const { identifier, password } = opts

    const user = await adapter.getUserByIndentifier(identifier)
    if (!user) throw new Error('Invalid credentials')

    if (user.status === 'inactive')
      throw new Error(
        'Your account has been suspended. Please contact support for assistance.',
      )

    const account = await adapter.getAccount('credentials', user.id)
    if (!account?.password) throw new Error('Invalid credentials')

    const isValid = await new Password().verify(account.password, password)
    if (!isValid) throw new Error('Invalid credentials')

    return createSession(user.id, headers)
  }

  async function signOut(opts: { headers: Headers }): Promise<void> {
    const cookies = new Cookies(opts as Request)
    const token = cookies.get(cookieKeys.token) ?? ''

    const hashToken = encodeHex(await hashSecret(token))
    await adapter.deleteSession(hashToken)
  }

  async function getOrCreateUser(
    opts: Omit<OauthAccount & NewAccount, 'userId'>,
    headers: Headers,
  ): Promise<Omit<Session, 'user'>> {
    const { provider, accountId, ...userData } = opts
    const existingAccount = await adapter.getAccount(provider, accountId)
    if (existingAccount) {
      if (existingAccount.status === 'inactive')
        throw new Error(
          'Your account has been suspended. Please contact support for assistance.',
        )

      return createSession(existingAccount.userId, headers)
    }

    const existingUser = await adapter.getUserByIndentifier(userData.email)
    const userId =
      existingUser?.id ?? (await adapter.createUser(userData)) ?? ''
    if (!userId) throw new Error('Failed to create user')

    await adapter.createAccount({ userId, provider, accountId, password: null })
    return createSession(userId, headers)
  }

  const ratelimiters = new TokenBucketRateLimit(10, 60)
  const ratelimitMiddleware = (request: Request, consume: number) => {
    const ip =
      request.headers.get('x-forwarded-for') ??
      request.headers.get('x-real-ip') ??
      'unknown'
    const allowed = ratelimiters.consume(ip, consume)
    return allowed
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
           * [GET] /api/auth/set-cookie: Set a test cookie (for dashboard use)
           */
          if (pathname === '/api/auth/set-session') {
            const response = new Response(null, {
              status: 302,
              headers: { Location: '/' },
            })
            const token = searchParams.get('token') ?? ''
            const expires = searchParams.get('expires') ?? ''
            cookies.set(response, cookieKeys.token, token, {
              ...cookieOptions,
              expires,
            })
            return setCorsHeaders(response)
          }

          const allowed = ratelimitMiddleware(request, 1)
          if (!allowed)
            return setCorsHeaders(
              new Response('Too Many Requests', { status: 429 }),
            )

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
            let redirectTo = cookies.get(cookieKeys.redirect) ?? '/'
            if (state !== storedState || !code || !codeVerifier)
              throw new Error('Invalid state or code')

            const userData = await instance.fetchUserData(code, codeVerifier)
            const session = await getOrCreateUser(
              { ...userData, provider, password: null },
              request.headers,
            )

            if (redirectTo.startsWith('http')) {
              const url = new URL(redirectTo)
              url.searchParams.set('token', session.token)
              url.searchParams.set('expires', session.expires.toISOString())
              redirectTo = url.toString()
            }

            const Location = new URL(
              redirectTo,
              `${env.NODE_ENV === 'production' ? 'https' : 'http'}://${env.NEXT_PUBLIC_WEB_URL}`,
            ).toString()
            const response = new Response(null, {
              status: 302,
              headers: { Location },
            })

            if (!redirectTo.startsWith('http'))
              cookies.set(response, cookieKeys.token, session.token, {
                ...cookieOptions,
                expires: session.expires,
              })

            for (const key of Object.values(cookieKeys))
              cookies.delete(response, key)
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
        const allowed = ratelimitMiddleware(request, 2)
        if (!allowed)
          return setCorsHeaders(
            new Response('Too Many Requests', { status: 429 }),
          )

        const cookies = new Cookies(request)
        const { pathname } = new URL(request.url)

        try {
          /**
           * [POST] /api/auth/sign-in: Sign in with email and password
           */
          if (pathname === '/api/auth/sign-in') {
            const body = (await request.json()) as AuthValidator.LoginBody
            const result = await signIn(body, request.headers)

            const response = Response.json(result)
            if (body.setSession)
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
    secure: env.VERCEL_ENV === 'production',
    sameSite: 'Lax',
    ...(env.VERCEL_ENV === 'production' && {
      domain: `.${env.WEB_URL}`,
    }),
  },
} as const satisfies Omit<
  Required<AuthOptions>,
  'adapter' | 'providers' | 'session'
>
