import type { SessionWithUser } from '@/types'
import type { AuthValidators } from '@yukinu/validators/auth'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as React from 'react'

type SessionContextValue = (
  | { status: 'loading'; session: SessionWithUser }
  | { status: 'unauthenticated'; session: null }
  | {
      status: 'authenticated'
      session: SessionWithUser & { user: NonNullable<SessionWithUser['user']> }
    }
) & {
  signIn: (
    credentials: AuthValidators.LoginInput,
  ) => Promise<AuthValidators.LoginOutput>

  signOut: () => Promise<void>
}

interface SessionProviderProps {
  children: React.ReactNode
  session?: SessionWithUser
  getSessionFn?: () => Promise<SessionWithUser>
  basePath?: string
}

const SessionContext = React.createContext<SessionContextValue | null>(null)

const useSession = () => {
  const context = React.use(SessionContext)
  if (!context)
    throw new Error('useSession must be used within a SessionProvider')
  return context
}

function SessionProvider(props: Readonly<SessionProviderProps>) {
  const { session, getSessionFn, basePath = '/api/auth', children } = props

  const queryClient = useQueryClient()

  const defaultGetSessionFn = async () => {
    const res = await fetch(`${basePath}/get-session`)
    if (!res.ok) throw new Error('Failed to fetch session')
    return res.json() as Promise<SessionWithUser>
  }

  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'get-session'],
    queryFn: getSessionFn ?? defaultGetSessionFn,
    initialData: session,
    enabled: !session,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: !session,
    retry: false,
  })

  const { mutateAsync: signIn } = useMutation({
    mutationKey: ['auth', 'sign-in'],
    mutationFn: async (credentials: AuthValidators.LoginInput) => {
      const res = await fetch(`${basePath}/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      if (!res.ok) throw new Error(await res.text())
      return res.json() as Promise<AuthValidators.LoginOutput>
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['auth', 'get-session'] }),
  })

  const { mutateAsync: signOut } = useMutation({
    mutationKey: ['auth', 'sign-out'],
    mutationFn: async () => {
      const res = await fetch(`${basePath}/sign-out`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to sign out')
    },
    onSuccess: () =>
      queryClient.setQueryData(['auth', 'get-session'], { user: null }),
  })

  const value = React.useMemo(() => {
    const status = isLoading
      ? 'loading'
      : data?.user
        ? 'authenticated'
        : 'unauthenticated'

    return { status, session: data, signIn, signOut } as SessionContextValue
  }, [data, isLoading, signIn, signOut])

  return <SessionContext value={value}>{children}</SessionContext>
}

export { SessionProvider, useSession }
