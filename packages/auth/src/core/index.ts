import { env } from '@yukinu/validators/env'

import type { AuthOptions, NewAccount, OauthAccount, Session } from '@/types'
import Cookies from '@/core/cookies'
import {
  encodeHex,
  generateSecureString,
  generateStateOrCode,
  hashSecret,
} from '@/core/crypto'
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
  ): Promise<Pick<Session, 'token' | 'expires'>> {
    const token = generateSecureString()
    const hashToken = await hashSecret(token)
    const expires = new Date(Date.now() + session.expiresIn * 1000)

    const userAgent = headers.get('user-agent') ?? ''
    const ipAddress = headers.get('x-forwarded-for') ?? ''

    await adapter.createSession({
      token: encodeHex(hashToken),
      userId,
      expires,
      userAgent,
      ipAddress,
    })

    return { token, expires }
  }

  async function createSessionCookie(
    userId: string,
    headers: Headers = new Headers(),
  ): Promise<Pick<Session, 'token' | 'expires'> & { cookie: string }> {
    const session = await createSession(userId, headers)
    let cookie = `${cookieKeys.token}=${session.token}; Expires=${session.expires.toUTCString()}`
    cookie += buildCookieOptions(cookieOptions)
    return { ...session, cookie }
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

  async function invalidateSession(
    headers: Headers,
  ): Promise<string | undefined> {
    const cookieHeader = headers.get('cookie') ?? ''
    const token =
      cookieHeader
        .split('; ')
        .find((row) => row.startsWith(`${cookieKeys.token}=`))
        ?.split('=')[1] ?? headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return

    const hashToken = encodeHex(await hashSecret(token))
    await adapter.deleteSession(hashToken)

    return `${cookieKeys.token}=; Expires=${new Date(0).toUTCString()}`
  }

  async function getOrCreateUser(
    opts: Omit<OauthAccount & NewAccount, 'userId'>,
    headers: Headers,
  ): Promise<Pick<Session, 'token' | 'expires'>> {
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
    createSessionCookie,
    invalidateSession,
    handlers: (base = '') => ({
      GET: async (request: Request) => {
        const { pathname, searchParams } = new URL(request.url)
        const cookies = new Cookies(request)

        try {
          /**
           * [GET] /api/auth/get-session: Get current session
           */
          if (pathname === `${base}/api/auth/get-session`) {
            const session = await auth(request)
            return setCorsHeaders(Response.json(session))
          }

          const allowed = ratelimitMiddleware(request, 1)
          if (!allowed)
            return setCorsHeaders(
              new Response('Too Many Requests', { status: 429 }),
            )

          /**
           * [GET] /api/auth/:provider: Handle OAuth callback
           */
          const callbackMatch = /^\/api\/auth\/([^/]+)$/.exec(pathname)
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
        const allowed = ratelimitMiddleware(request, 2)
        if (!allowed)
          return setCorsHeaders(
            new Response('Too Many Requests', { status: 429 }),
          )

        const { pathname, searchParams } = new URL(request.url)

        /**
         * [POST] /api/auth/:provider: Start OAuth flow
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

          response.headers.append(
            'Set-Cookie',
            `${cookieKeys.state}=${state}; Max-Age=300; Path=/`,
          )
          response.headers.append(
            'Set-Cookie',
            `${cookieKeys.code}=${codeVerifier}; Max-Age=300; Path=/`,
          )
          response.headers.append(
            'Set-Cookie',
            `${cookieKeys.redirect}=${redirectUrl}; Max-Age=300; Path=/`,
          )
          return setCorsHeaders(response)
        }

        await new Promise((resolve) => setTimeout(resolve, 100))
        return setCorsHeaders(new Response('Not Found', { status: 404 }))
      },
    }),
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
    secure: env.NODE_ENV === 'production',
    sameSite: 'Lax',
  },
} as const satisfies Omit<
  Required<AuthOptions>,
  'adapter' | 'providers' | 'session'
>

function buildCookieOptions(
  options: Partial<AuthOptions['cookieOptions']> = {},
) {
  let opts = ''
  for (const [key, value] of Object.entries(options)) {
    if (typeof value === 'boolean') opts += `; ${key}`
    else opts += `; ${key}=${value}`
  }
  return opts
}
