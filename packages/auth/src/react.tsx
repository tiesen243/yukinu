'use client'

import * as React from 'react'

import type { Providers } from './config'
import type { SessionResult, User } from './core/types'

type AuthProviders =
  | 'credentials'
  | (Providers extends never ? undefined : Providers)

type SessionContextValue = {
  signIn: <TProvider extends AuthProviders>(
    provider: TProvider,
    ...args: TProvider extends 'credentials'
      ? [{ email: string; password: string }]
      : [{ redirectUrl?: string }?]
  ) => Promise<void>
  signOut: (opts?: { redirectUrl: string }) => Promise<void>
} & (
  | { status: 'loading'; session: SessionResult }
  | { status: 'unauthenticated'; session: SessionResult & { user: null } }
  | { status: 'authenticated'; session: SessionResult & { user: User } }
)

const nullSessionResult: SessionResult = {
  user: null,
  userAgent: null,
  ipAddress: null,
  expires: new Date(),
}

const SessionContext = React.createContext<SessionContextValue | null>(null)

function useSession() {
  const context = React.use(SessionContext)
  if (!context)
    throw new Error('useSession must be used within a SessionProvider')
  return context
}

function SessionProvider({
  session: _session,
  children,
}: Readonly<{ children: React.ReactNode; session?: SessionResult }>) {
  const hasInitialSession = !!_session

  const [isLoading, startTransition] = React.useTransition()
  const [session, setSession] = React.useState<SessionResult>(() => {
    if (hasInitialSession) return _session
    return nullSessionResult
  })

  const status = React.useMemo(() => {
    if (isLoading) return 'loading'
    return session.user ? 'authenticated' : 'unauthenticated'
  }, [isLoading, session])

  const fetchSession = React.useCallback(
    (token?: string, abortController?: AbortController) => {
      startTransition(async () => {
        const res = await fetch('/api/auth/get-session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
          signal: abortController?.signal,
        })

        if (!res.ok) setSession(nullSessionResult)
        else setSession((await res.json()) as SessionResult)
      })
    },
    [startTransition],
  )

  const signIn = React.useCallback(
    async <TProvider extends AuthProviders>(
      provider: TProvider,
      ...args: TProvider extends 'credentials'
        ? [{ email: string; password: string }]
        : [{ redirectUrl?: string }?]
    ): Promise<void> => {
      if (provider === 'credentials') {
        const abortController = new AbortController()

        const res = await fetch('/api/auth/sign-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(args[0]),
        })

        if (!res.ok) {
          const text = await res.text()
          abortController.abort()
          throw new Error(text)
        } else {
          const json = (await res.json()) as { token: string; expires: string }
          fetchSession(json.token, abortController)
        }
      } else {
        const redirectUrl = (args[0] as { redirectUrl?: string }).redirectUrl
        window.location.href = `/api/auth/${provider}${
          redirectUrl ? `?redirectUrl=${encodeURIComponent(redirectUrl)}` : ''
        }`
      }
    },
    [fetchSession],
  )

  const signOut = React.useCallback(async (opts?: { redirectUrl: string }) => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    setSession(nullSessionResult)
    if (opts?.redirectUrl) window.location.href = opts.redirectUrl
  }, [])

  React.useEffect(() => {
    if (hasInitialSession) return

    const abortController = new AbortController()
    fetchSession(undefined, abortController)

    return () => {
      abortController.abort()
    }
  }, [hasInitialSession, fetchSession])

  const value = React.useMemo(
    () => ({ status, session, signIn, signOut }),
    [status, session, signIn, signOut],
  ) as SessionContextValue

  return <SessionContext value={value}>{children}</SessionContext>
}

export { useSession, SessionProvider }
