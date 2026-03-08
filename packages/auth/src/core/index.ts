import type { LoginInput, Role } from '@yukinu/validators/auth'

import { TokenBucketRateLimit } from '@yukinu/lib/rate-limit'
import { loginInput } from '@yukinu/validators/auth'

import type { AuthConfig, Session, SessionWithUser, User } from '@/core/types'

import {
  constantTimeEqual,
  decodeHex,
  encodeHex,
  generateSecureString,
  generateStateOrCode,
  hashSecret,
} from '@/core/crypto'
import { JWT } from '@/core/jwt'
import { Password } from '@/core/password'

const PATH_REGEXS = {
  getSession: /^(?:\/([^/]+))?\/api\/auth\/session$/,
  getCurrentUser: /^(?:\/([^/]+))?\/api\/auth\/current-user$/,
  refreshToken: /^(?:\/([^/]+))?\/api\/auth\/refresh-token$/,

  signIn: /^(?:\/([^/]+))?\/api\/auth\/sign-in$/,
  signOut: /^(?:\/([^/]+))?\/api\/auth\/sign-out$/,

  oauth: /^(?:\/([^/]+))?\/api\/auth\/([^/]+)$/,
  oauthCallback: /^(?:\/([^/]+))?\/api\/auth\/([^/]+)\/callback$/,
} as const

class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export function Auth(config: AuthConfig) {
  const { providers, adapter, cookies } = config
  const jwt = new JWT<{
    sub: string
    role: Role
  }>(config.secret)

  async function createAccessToken(userId: string): Promise<string> {
    const user = await adapter.getUser(userId)
    if (!user) throw new Error('User not found')

    const payload = { sub: userId, role: user.role }
    return jwt.sign(payload, {
      expiresIn: config.session.accessTokenExpiresIn,
    })
  }

  async function verifyAccessToken(opts: {
    headers: Headers
  }): Promise<{ userId: string; role: Role } | null> {
    const token =
      parseCookie(opts.headers.get('Cookie'))[cookies.keys.accessToken] ??
      opts.headers.get('Authorization')?.replace(/^Bearer\s+/, '')
    if (!token) return null

    try {
      const { sub: userId, role } = await jwt.verify(token)
      return { userId, role }
    } catch (error) {
      // oxlint-disable-next-line node/no-process-env
      if (process.env.NODE_ENV === 'development') console.log(error)
      return null
    }
  }

  async function createSession(
    userId: string,
    opts = DEFAULT_SESSION_OPTS,
  ): Promise<{ accessToken: string; refreshToken: string; expiresAt: Date }> {
    const id = generateSecureString()
    const secret = generateSecureString()
    const hashedSecret = await hashSecret(secret)

    const refreshToken = `${id}.${secret}`
    const expiresAt = new Date(Date.now() + config.session.expiresIn * 1000)

    await adapter.createSession({
      ...opts,
      id,
      userId: userId,
      token: encodeHex(hashedSecret),
      expiresAt,
    })

    const accessToken = await createAccessToken(userId)

    return { accessToken, refreshToken, expiresAt }
  }

  async function auth(opts: { headers: Headers }): Promise<SessionWithUser> {
    const token =
      parseCookie(opts.headers.get('Cookie'))[cookies.keys.refreshToken] ??
      opts.headers.get('Authorization')?.replace(/^Bearer\s+/, '')
    if (!token) return DEFAULT_SESSION_USER

    try {
      const [id, secret] = token.split('.')
      if (!id || !secret) return DEFAULT_SESSION_USER

      const result = await adapter.getSessionWithUser(id)
      if (!result) return DEFAULT_SESSION_USER
      const { session, user } = result

      const hashedSecret = await hashSecret(secret)
      const isValid = constantTimeEqual(hashedSecret, decodeHex(session.token))

      const now = Date.now()
      const expiresTime = new Date(session.expiresAt).getTime()

      if (
        !isValid ||
        now >= expiresTime ||
        // session.ipAddress !== opts.headers.get('X-Forwarded-For') ||
        session.userAgent !== opts.headers.get('User-Agent')
      ) {
        await adapter.deleteSession(id)
        return DEFAULT_SESSION_USER
      }

      if (now >= expiresTime - config.session.expiresThreshold * 1000) {
        const newExpiresAt = new Date(now + config.session.expiresIn * 1000)
        await adapter.updateSession({ id, expiresAt: newExpiresAt })
        session.expiresAt = newExpiresAt
      }

      return { token, user, expiresAt: session.expiresAt }
    } catch (error) {
      // oxlint-disable-next-line node/no-process-env
      if (process.env.NODE_ENV === 'development') console.log(error)
      return DEFAULT_SESSION_USER
    }
  }

  async function currentUser(opts: { headers: Headers }): Promise<User | null> {
    const payload = await verifyAccessToken(opts)
    if (!payload) return null

    const user = await adapter.getUser(payload.userId)
    if (!user) return null

    return user
  }

  async function signIn(
    data: LoginInput,
    opts = DEFAULT_SESSION_OPTS,
  ): Promise<ReturnType<typeof createSession>> {
    const user = await adapter.getUserByIdentity({
      username: data.identifier,
      email: data.identifier,
    })
    if (!user?.password) throw new AuthError('Invalid credentials')
    if (user.emailVerified === null) throw new AuthError('Email not verified')

    if (!(await new Password().verify(user.password, data.password)))
      throw new AuthError('Invalid credentials')

    return createSession(user.id, opts)
  }

  async function signOut({ headers }: { headers: Headers }): Promise<void> {
    const token =
      parseCookie(headers.get('Cookie'))[cookies.keys.refreshToken] ??
      headers.get('Authorization')?.replace(/^Bearer\s+/, '')
    if (!token) throw new AuthError('No refresh token provided')

    const [id] = token.split('.')
    if (id) await adapter.deleteSession(id)
  }

  async function startOAuthFlow(url: URL): Promise<Response> {
    const provider = url.pathname.match(PATH_REGEXS.oauth)?.[2]
    const instance = providers.find((p) => p.providerName === provider)
    if (!instance) throw new Error(`Provider "${provider}" not supported`)

    const state = generateStateOrCode()
    const code = generateStateOrCode()
    const redirect = url.searchParams.get('redirect_uri') ?? '/'
    const authorizationUrl = await instance.createAuthorizationUrl(state, code)

    const response = new Response(null, { status: 302 })
    response.headers.set('Location', authorizationUrl.toString())
    response.headers.append(
      'Set-Cookie',
      serializeCookie(cookies.keys.state, state, { 'Max-Age': 300 }),
    )
    response.headers.append(
      'Set-Cookie',
      serializeCookie(cookies.keys.codeVerifier, code, { 'Max-Age': 300 }),
    )
    response.headers.append(
      'Set-Cookie',
      serializeCookie(cookies.keys.redirectUri, redirect, { 'Max-Age': 300 }),
    )

    return response
  }

  async function handleOAuthCallback(
    url: URL,
    headers: Headers,
  ): Promise<Response> {
    const provider = url.pathname.match(PATH_REGEXS.oauthCallback)?.[2] ?? ''
    const instance = providers.find((p) => p.providerName === provider)
    if (!instance) throw new Error(`Provider "${provider}" not supported`)

    const cookieStore = parseCookie(headers.get('Cookie'))

    const state = url.searchParams.get('state')
    const storedState = cookieStore[cookies.keys.state]
    const code = url.searchParams.get('code') ?? ''
    const storedCode = cookieStore[cookies.keys.codeVerifier] ?? ''

    if (!state || !storedState || state !== storedState)
      throw new AuthError('Invalid state')

    const { id, ...userData } = await instance.fetchUserData(code, storedCode)
    const user = await adapter.getUserByAccount({
      provider,
      providerAccountId: id,
    })

    let userId: string
    if (user) {
      userId = user.id
    } else {
      const userByEmail = await adapter.getUserByEmail(userData.email)
      if (userByEmail) userId = userByEmail.id
      else {
        const newUser = await adapter.createUser(userData)
        userId = newUser.id
      }

      await adapter.createAccount({
        userId,
        provider,
        providerAccountId: id,
        password: null,
      })
    }

    const session = await createSession(userId)
    let redirectUri = cookieStore[cookies.keys.redirectUri] ?? '/'

    const response = new Response(null, { status: 302 })
    if (['http:', 'https:', 'exp:'].some((p) => redirectUri.startsWith(p)))
      redirectUri = `${redirectUri}?access_token=${session.accessToken}&refresh_token=${session.refreshToken}`
    response.headers.set('Location', redirectUri)
    response.headers.append(
      'Set-Cookie',
      serializeCookie(cookies.keys.refreshToken, session.refreshToken, {
        ...cookies.options,
        expires: session.expiresAt.toUTCString(),
      }),
    )
    response.headers.append(
      'Set-Cookie',
      serializeCookie(cookies.keys.accessToken, session.accessToken, {
        ...cookies.options,
        'Max-Age': config.session.accessTokenExpiresIn,
      }),
    )

    return response
  }

  async function handleGet(req: Request): Promise<Response> {
    const url = new URL(req.url)

    if (PATH_REGEXS.getSession.test(url.pathname)) {
      const session = await auth({ headers: req.headers })
      if (!session.user)
        return Response.json({ error: 'Not authenticated' }, { status: 401 })

      return Response.json(session, { status: 200 })
    } else if (PATH_REGEXS.getCurrentUser.test(url.pathname)) {
      const user = await currentUser({ headers: req.headers })
      if (!user)
        return Response.json({ error: 'Not authenticated' }, { status: 401 })

      return Response.json({ user }, { status: 200 })
    } else if (PATH_REGEXS.oauth.test(url.pathname)) return startOAuthFlow(url)
    else if (PATH_REGEXS.oauthCallback.test(url.pathname))
      return handleOAuthCallback(url, req.headers)

    return Response.json({ error: 'Not Found' }, { status: 404 })
  }

  async function handlePost(req: Request): Promise<Response> {
    const url = new URL(req.url)

    if (PATH_REGEXS.signIn.test(url.pathname)) {
      const { identifier, password } = await req.json()
      const parsed = loginInput.safeParse({ identifier, password })
      if (!parsed.success)
        return Response.json(
          { error: 'Invalid input', details: parsed.error },
          { status: 400 },
        )

      const session = await signIn(parsed.data)
      const response = Response.json(session, { status: 200 })

      response.headers.append(
        'Set-Cookie',
        serializeCookie(cookies.keys.refreshToken, session.refreshToken, {
          ...cookies.options,
          expires: session.expiresAt.toUTCString(),
        }),
      )
      response.headers.append(
        'Set-Cookie',
        serializeCookie(cookies.keys.accessToken, session.accessToken, {
          ...cookies.options,
          'Max-Age': config.session.accessTokenExpiresIn,
        }),
      )

      return response
    } else if (PATH_REGEXS.signOut.test(url.pathname)) {
      await signOut({ headers: req.headers })
      const response = new Response(null, { status: 204 })

      response.headers.append(
        'Set-Cookie',
        serializeCookie(cookies.keys.accessToken, '', { 'Max-Age': 0 }),
      )
      response.headers.append(
        'Set-Cookie',
        serializeCookie(cookies.keys.refreshToken, '', { 'Max-Age': 0 }),
      )

      return response
    } else if (PATH_REGEXS.refreshToken.test(url.pathname)) {
      const session = await auth({ headers: req.headers })
      if (!session.user) throw new AuthError('Not authenticated')

      const newToken = await createAccessToken(session.user.id)
      const response = Response.json({ accessToken: newToken }, { status: 200 })
      response.headers.append(
        'Set-Cookie',
        serializeCookie(cookies.keys.accessToken, newToken, cookies.options),
      )

      return response
    }

    return Response.json({ error: 'Not Found' }, { status: 404 })
  }

  const bucket = new TokenBucketRateLimit<string>(10, 60)
  async function handlers(req: Request): Promise<Response> {
    let response: Response | null = null

    const ip =
      req.headers.get('X-Forwarded-For') ??
      req.headers.get('x-real-ip') ??
      'unknown'
    if (!bucket.consume(ip, req.method === 'POST' ? 2 : 1))
      return Response.json({ error: 'Too many requests' }, { status: 429 })

    try {
      if (req.method === 'GET') response = await handleGet(req)
      else if (req.method === 'POST') response = await handlePost(req)
      else if (req.method === 'OPTIONS')
        response = new Response(null, { status: 204 })
      else
        response = Response.json(
          { error: 'Method not allowed' },
          { status: 405 },
        )
    } catch (error) {
      // oxlint-disable-next-line node/no-process-env
      if (process.env.NODE_ENV === 'development') console.log(error)

      const _error = error instanceof Error ? error.message : 'Unknown error'
      const status = error instanceof AuthError ? 401 : 500
      response = Response.json({ error: _error }, { status })
    }

    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    )

    return response
  }

  return {
    auth,
    currentUser,
    verifyAccessToken,

    signIn,
    signOut,

    handlers,
  }
}

function parseCookie(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {}

  const cookies: Record<string, string> = {}
  const pairs = cookieHeader.split(';')

  for (const pair of pairs) {
    const [key = '', value = ''] = pair.trim().split('=')
    cookies[key] = decodeURIComponent(value)
  }

  return cookies
}

function serializeCookie(
  name: string,
  value: string,
  options: Record<string, unknown> = {},
): string {
  let cookie = `${name}=${encodeURIComponent(value)}`

  for (const [key, val] of Object.entries(options)) {
    if (val === true) cookie += `; ${key}`
    else if (val !== false) cookie += `; ${key}=${val}`
  }

  return cookie
}

const DEFAULT_SESSION_OPTS = {
  ipAddress: null,
  userAgent: null,
} satisfies Pick<Session, 'ipAddress' | 'userAgent'>

const DEFAULT_SESSION_USER = {
  token: '',
  user: null,
  expiresAt: new Date(),
} satisfies SessionWithUser
