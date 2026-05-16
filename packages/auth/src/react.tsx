import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as React from 'react'

import type { LoginInput, LoginOutput, User } from '@/core/types'

const QUERY_KEY = [['auth', 'currentUser'], { type: 'query' }]

type SessionContextValue = (
  | { status: 'loading'; user: User | null }
  | { status: 'unauthenticated'; user: null }
  | { status: 'authenticated'; user: User }
) & {
  signIn: (credentials: LoginInput) => Promise<LoginOutput>
  signOut: () => Promise<void>
  refreshToken: () => Promise<void>
}

interface SessionProviderProps {
  children: React.ReactNode
  user?: User | null
  getUserFn?: () => Promise<User | null>
  basePath?: string
}

const SessionContext = React.createContext<SessionContextValue | null>(null)

const useSession = () => {
  const context = React.use(SessionContext)
  if (!context)
    throw new Error('useSession must be used within a SessionProvider')
  return context
}

const defaultGetUserFn = async () => {
  const res = await fetch('/api/auth/current-user')
  if (!res.ok) throw new Error('Failed to fetch session')
  return res.json() as Promise<User | null>
}

function SessionProvider(props: Readonly<SessionProviderProps>) {
  const { user, getUserFn, children } = props

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getUserFn ?? defaultGetUserFn,
    initialData: user,
    enabled: !user,
    refetchOnMount: !user,
    refetchOnReconnect: !user,
  })

  const { mutateAsync: signIn } = useMutation({
    mutationKey: [['auth', 'sign-in'], { type: 'mutation' }],
    mutationFn: async (credentials: LoginInput) => {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (!res.ok) throw new Error(await res.text())
      return res.json() as Promise<LoginOutput>
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const { mutateAsync: signOut } = useMutation({
    mutationKey: [['auth', 'sign-out'], { type: 'mutation' }],
    mutationFn: async () => {
      const res = await fetch('/api/auth/sign-out', { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
    },
    onSuccess: () => queryClient.setQueriesData({ queryKey: QUERY_KEY }, null),
  })

  const { mutateAsync: refreshToken } = useMutation({
    mutationKey: [['auth', 'refresh-token'], { type: 'mutation' }],
    mutationFn: async () => {
      const res = await fetch('/api/auth/refresh-token', { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const value = React.useMemo(() => {
    let status = 'unauthenticated'
    if (isLoading) status = 'loading'
    else if (data) status = 'authenticated'

    return { status, user: data, signIn, signOut, refreshToken }
  }, [data, isLoading, signIn, signOut, refreshToken]) as SessionContextValue

  return <SessionContext value={value}>{children}</SessionContext>
}

export { SessionProvider, useSession }
