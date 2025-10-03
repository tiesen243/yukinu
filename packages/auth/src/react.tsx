'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'

import type { signIn as ServerSignIn } from '.'
import type { Providers } from './config'
import type { SessionResult, User } from './core/types'

type AuthProviders =
  | 'credentials'
  | (Providers extends never ? undefined : Providers)

type SessionContextValue = {
  signIn: <TProvider extends AuthProviders>(
    provider: TProvider,
    ...args: TProvider extends 'credentials'
      ? [Parameters<typeof ServerSignIn>[0]]
      : [{ redirectUrl?: string }?]
  ) => Promise<void>
  signOut: (opts?: { redirectUrl: string }) => Promise<void>
} & (
  | { status: 'loading'; session: SessionResult }
  | { status: 'unauthenticated'; session: SessionResult & { user: null } }
  | { status: 'authenticated'; session: SessionResult & { user: User } }
)

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

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch('/api/auth/get-session', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      return res.json() as Promise<SessionResult>
    },
    enabled: !hasInitialSession,
    initialData: hasInitialSession ? _session : undefined,
  })

  const signIn = React.useCallback(
    async <TProvider extends AuthProviders>(
      provider: TProvider,
      ...args: TProvider extends 'credentials'
        ? [Parameters<typeof ServerSignIn>[0]]
        : [{ redirectUrl?: string }?]
    ): Promise<void> => {
      if (provider === 'credentials') {
        const res = await fetch('/api/auth/sign-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(args[0]),
        })

        if (!res.ok) throw new Error(await res.text())
        else await refetch()
      } else {
        const redirectUrl = (args[0] as { redirectUrl?: string }).redirectUrl
        window.location.href = `/api/auth/${provider}${
          redirectUrl ? `?redirectUrl=${encodeURIComponent(redirectUrl)}` : ''
        }`
      }
    },
    [],
  )

  const signOut = React.useCallback(async (opts?: { redirectUrl: string }) => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    if (opts?.redirectUrl) window.location.href = opts.redirectUrl
  }, [])

  const blankSession: SessionResult = {
    user: null,
    ipAddress: null,
    userAgent: null,
    expires: new Date(),
  }

  const value = React.useMemo<SessionContextValue>(() => {
    const valueBase = { signIn, signOut }
    if (isLoading)
      return { ...valueBase, session: blankSession, status: 'loading' }
    else if (isError || !data?.user)
      return {
        ...valueBase,
        session: { ...blankSession, user: null },
        status: 'unauthenticated',
      }
    else
      return {
        ...valueBase,
        session: { ...data, user: data.user },
        status: 'authenticated',
      }
  }, [signIn, signOut, isLoading, isError, data, blankSession])

  return <SessionContext value={value}>{children}</SessionContext>
}

export { useSession, SessionProvider }
