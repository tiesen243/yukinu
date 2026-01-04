import type { QueryClient } from '@tanstack/react-query'
import type { AppRouter } from '@yukinu/api'

import { QueryClientProvider } from '@tanstack/react-query'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import { SessionProvider } from '@yukinu/auth/react'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import { useState } from 'react'

import { trpcClient as _trpcClient } from '@/lib/trpc/client'

const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>()

let clientQueryClientSingleton: QueryClient | undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  return (clientQueryClientSingleton ??= createQueryClient())
}

function TRPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() => _trpcClient)

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <SessionProvider getSessionFn={trpcClient.auth.currentUser.query}>
          {children}
        </SessionProvider>
      </TRPCProvider>
    </QueryClientProvider>
  )
}

export { TRPCReactProvider, useTRPC, useTRPCClient }
