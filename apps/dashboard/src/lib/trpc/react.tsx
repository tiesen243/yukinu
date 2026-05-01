import type { QueryClient } from '@tanstack/react-query'

import { QueryClientProvider } from '@tanstack/react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { AppRouter, createTRPCClient } from '@yukinu/api'
import { SessionProvider } from '@yukinu/auth/react'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import * as React from 'react'

import { getDashboardUrl } from '@/lib/utils'

let clientQueryClientSingleton: QueryClient | undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  return (clientQueryClientSingleton ??= createQueryClient())
}

interface TRPCContextValue {
  trpc: ReturnType<typeof createTRPCOptionsProxy<AppRouter>>
  trpcClient: ReturnType<typeof createTRPCClient>
}

const TRPCContext = React.createContext<TRPCContextValue | null>(null)

function TRPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  const [trpcClient] = React.useState(() =>
    createTRPCClient('dashboard', getDashboardUrl()),
  )

  const memoizedValue = React.useMemo(
    () => ({
      trpc: createTRPCOptionsProxy({ client: trpcClient, queryClient }),
      trpcClient,
    }),
    [trpcClient],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCContext value={memoizedValue}>
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

export { TRPCReactProvider, useTRPC }
