import type { QueryClient } from '@tanstack/react-query'
import type { AppRouter } from '@yukinu/api/client'

import { QueryClientProvider } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { createTRPCClient } from '@yukinu/api/client'
import { SessionProvider } from '@yukinu/auth/react'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import * as React from 'react'

import { env } from '@/lib/env'

interface TRPCContextValue {
  trpcClient: ReturnType<typeof createTRPCClient>
  trpc: ReturnType<typeof createTRPCOptionsProxy<AppRouter>>
}

const TRPCContext = React.createContext<TRPCContextValue | null>(null)

let clientQueryClientSingleton: QueryClient | undefined
export const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  return (clientQueryClientSingleton ??= createQueryClient())
}

const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = getQueryClient()
  const [trpcClient] = React.useState(() =>
    createTRPCClient('dashboard', env.VITE_DASHBOARD_URL),
  )

  const value = React.useMemo(
    () => ({
      trpcClient,
      trpc: createTRPCOptionsProxy({
        client: trpcClient,
        queryClient,
      }),
    }),
    [trpcClient, queryClient],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCContext value={value}>
        <SessionProvider getUserFn={trpcClient.identity.auth.currentUser.query}>
          {children}
        </SessionProvider>
      </TRPCContext>
    </QueryClientProvider>
  )
}

const useTRPC = () => {
  const context = React.use(TRPCContext)
  if (!context) throw new Error('useTRPC must be used within a TRPCProvider')
  return context
}

export { TRPCProvider, useTRPC }
