import { AuthModels } from '@yukinu/validators/auth'

import type { AuthOptions, Session } from '@/types'
import { createSessionCookie } from '@/config'
import {
  encodeHex,
  generateSecureString,
  generateStateOrCode,
  hashSecret,
} from '@/core/crypto'
import { Password } from '@/core/password'

const PATH_REGEXS = {
  getSession: /^(?:\/([^/]+))?\/api\/auth\/get-session$/,
  signIn: /^(?:\/([^/]+))?\/api\/auth\/sign-in$/,
  signOut: /^(?:\/([^/]+))?\/api\/auth\/sign-out$/,
  oauth: /^(?:\/([^/]+))?\/api\/auth\/([^/]+)$/,
} as const

export function Auth(opts: AuthOptions) {
  const { adapter, cookieKeys, providers, session } = opts

  async function createSession(
    userId: string,
    headers = new Headers(),
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

  async function auth(opts: { headers: Headers }) {
    const token =
      opts.headers
        .get('cookie')
        ?.split('; ')
        .find((row) => row.startsWith(`${cookieKeys.token}=`))
        ?.split('=')[1] ??
      opts.headers.get('authorization')?.replace('Bearer ', '') ??
      ''

    const hashToken = encodeHex(await hashSecret(token))

    try {
      const result = await adapter.getSessionAndUser(hashToken)
      if (!result) throw new Error('Session not found')

      const now = Date.now()
      const expiresTime = result.expires.getTime()
      const userAgent = opts.headers.get('user-agent') ?? ''

      if (now > expiresTime || result.userAgent !== userAgent) {
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
    input: AuthModels.LoginInput,
    headers = new Headers(),
  ): Promise<Pick<Session, 'token' | 'expires'>> {
    const { identifier, password } = input

    const user = await adapter.getUserByIndentifier(identifier)
    if (!user) throw new Error('Invalid credentials')
    if (user.status === 'inactive') throw new Error('Account is inactive')

    const account = await adapter.getAccount('credentials', user.id)
    if (!account?.password) throw new Error('Invalid credentials')

    if (!(await new Password().verify(account.password, password)))
      throw new Error('Invalid credentials')

    return createSession(user.id, headers)
  }

  async function signOut(opts: { headers: Headers }) {
    const token =
      opts.headers
        .get('cookie')
        ?.split('; ')
        .find((row) => row.startsWith(`${cookieKeys.token}=`))
        ?.split('=')[1] ??
      opts.headers.get('authorization')?.replace('Bearer ', '') ??
      ''

    const hashToken = encodeHex(await hashSecret(token))
    await adapter.deleteSession(hashToken)
  }

  return {
    auth,
    signIn,
    signOut,
    handlers: {
      GET: async (request: Request) => {
        const { pathname, searchParams } = new URL(request.url)

        const cookieHeader = request.headers.get('cookie') ?? ''
        const cookies = new Map<string, string>(
          cookieHeader.split('; ').map((c) => {
            const [key, ...v] = c.split('=')
            return [key, v.join('=')] as [string, string]
          }),
        )

        try {
          /**
           * [GET] /api/auth/get-session: Get current session
           */
          if (PATH_REGEXS.getSession.exec(pathname)) {
            const session = await auth(request)
            return setCorsHeaders(Response.json(session))
          }

          /**
           * [GET] /api/auth/:provider: Handle OAuth callback
           */
          const oauthMatch = PATH_REGEXS.oauth.exec(pathname)
          if (oauthMatch) {
            const [, , provider = ''] = oauthMatch
            const instance = providers[provider]
            if (!instance) throw new Error(`Provider ${provider} not found`)

            const code = searchParams.get('code') ?? ''
            const state = searchParams.get('state') ?? ''
            const storedState = cookies.get(cookieKeys.state) ?? ''
            const codeVerifier = cookies.get(cookieKeys.code) ?? ''
            let redirectTo = cookies.get(cookieKeys.redirect) ?? '/'
            if (state !== storedState || !code || !codeVerifier)
              throw new Error('Invalid state or code')

            const userData = await instance.fetchUserData(code, codeVerifier)
            const existingAccount = await adapter.getAccount(
              provider,
              userData.accountId,
            )

            let session: Pick<Session, 'token' | 'expires'>
            if (existingAccount) {
              if (existingAccount.status === 'inactive')
                throw new Error('Account is inactive')

              session = await createSession(
                existingAccount.userId,
                request.headers,
              )
            } else {
              const userId =
                (await adapter.getUserByIndentifier(userData.email))?.id ??
                (await adapter.createUser(userData)) ??
                ''

              await adapter.createAccount({
                userId,
                provider,
                accountId: userData.accountId,
                password: null,
              })
              session = await createSession(userId, request.headers)
            }

            const { token, expires } = session

            if (redirectTo.startsWith('http')) {
              const url = new URL(redirectTo)
              url.searchParams.set('token', token)
              url.searchParams.set('expires', expires.toISOString())
              redirectTo = url.toString()
            }

            const Location = new URL(redirectTo, request.url).toString()
            const response = new Response(null, {
              status: 302,
              headers: { Location },
            })

            for (const key of Object.values(cookieKeys))
              response.headers.append(
                'Set-Cookie',
                `${key}=; Expires=${new Date(0).toUTCString()}; Path=/`,
              )

            if (!redirectTo.startsWith('http'))
              response.headers.append(
                'Set-Cookie',
                createSessionCookie(token, { expires }),
              )

            return setCorsHeaders(response)
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Unknown error'
          return setCorsHeaders(
            Response.json({ error: message }, { status: 400 }),
          )
        }
      },

      POST: async (request: Request) => {
        const { pathname, searchParams } = new URL(request.url)

        try {
          /**
           * [POST] /api/auth/sign-in: Sign in with credentials
           */
          if (PATH_REGEXS.signIn.exec(pathname)) {
            const parsed = AuthModels.loginInput.safeParse(await request.json())
            if (!parsed.success) throw new Error(parsed.error.message)

            const { token, expires } = await signIn(
              parsed.data,
              request.headers,
            )
            const response = Response.json({ token, expires }, { status: 200 })

            response.headers.append(
              'Set-Cookie',
              createSessionCookie(token, { expires }),
            )

            return setCorsHeaders(response)
          }

          /**
           * [POST] /api/auth/sign-out: Sign out
           */
          if (PATH_REGEXS.signOut.exec(pathname)) {
            await signOut({ headers: request.headers })
            const response = new Response(null, { status: 200 })

            response.headers.append(
              'Set-Cookie',
              `${cookieKeys.token}=; Expires=${new Date(0).toUTCString()}; Path=/`,
            )

            return setCorsHeaders(response)
          }

          /**
           * [POST] /api/auth/:provider: Start OAuth flow
           */
          const oauthMatch = PATH_REGEXS.oauth.exec(pathname)
          if (oauthMatch) {
            const [, , provider = ''] = oauthMatch
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

          return setCorsHeaders(new Response('Not Found', { status: 404 }))
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Unknown error'
          return setCorsHeaders(
            Response.json({ error: message }, { status: 400 }),
          )
        }
      },

      OPTIONS: () => {
        return setCorsHeaders(new Response(null, { status: 204 }))
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
