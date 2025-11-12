'use client'

import * as React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import type { AuthModels } from '@yukinu/validators/auth'

import type { Session, User } from '@/types'

type SessionResult = Omit<Session, 'token' | 'userAgent' | 'ipAddress'>

type SessionContextValue = {
  signIn: (
    input: AuthModels.LoginInput,
  ) => Promise<{ token: string; expires: string }>
  signOut: () => Promise<void>
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
  base = '/api/auth',
  children,
}: Readonly<{
  children: React.ReactNode
  base?: string
  session?: SessionResult
}>) {
  const {
    data: session,
    status,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async ({ signal }) => {
      const res = await fetch(`${base}/get-session`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal,
      })

      const session = (await res.json()) as SessionResult
      if (!session.user) throw new Error('No active session')
      return session
    },
    initialData: _session ?? undefined,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: false,
  })

  const { mutateAsync: signIn } = useMutation({
    mutationKey: ['auth', 'sign-in'],
    mutationFn: async (input: AuthModels.LoginInput) => {
      const res = await fetch(`${base}/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      const json = (await res.json()) as
        | { error: string }
        | { token: string; expires: string }
      if ('error' in json) throw new Error(json.error)
      return json
    },
    onSuccess: () => refetch(),
  })

  const { mutateAsync: signOut } = useMutation({
    mutationKey: ['auth', 'sign-out'],
    mutationFn: async () => {
      const res = await fetch(`${base}/sign-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        const json = (await res.json()) as { error?: string }
        throw new Error(json.error)
      }
    },
    onSuccess: () => refetch(),
  })

  const value = React.useMemo(() => {
    const statusMap = {
      pending: 'loading',
      error: 'unauthenticated',
      success: 'authenticated',
    } as const
    return { status: statusMap[status], session, signIn, signOut }
  }, [status, session, signIn, signOut]) as SessionContextValue

  return <SessionContext value={value}>{children}</SessionContext>
}

export { useSession, SessionProvider }
