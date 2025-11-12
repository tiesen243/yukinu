'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'

import type { Session, User } from '@/types'

type SessionResult = Omit<Session, 'token' | 'userAgent' | 'ipAddress'>

type SessionContextValue = {
  refresh: () => Promise<unknown>
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
  base = '',
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
      const res = await fetch(`${base}/api/auth/get-session`, {
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

  const value = React.useMemo(() => {
    const statusMap = {
      pending: 'loading',
      error: 'unauthenticated',
      success: 'authenticated',
    } as const

    return { status: statusMap[status], session, refresh: refetch }
  }, [status, session, refetch]) as SessionContextValue

  return <SessionContext value={value}>{children}</SessionContext>
}

export { useSession, SessionProvider }
