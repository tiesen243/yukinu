import type { QueryClient } from '@tanstack/react-query'
import type { AppRouter } from '@yukinu/api'

import { QueryClientProvider } from '@tanstack/react-query'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import { createClient } from '@yukinu/api/client'
import { SessionProvider } from '@yukinu/auth/react'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import { env } from '@yukinu/validators/env.vite'
import { useState } from 'react'

import { getDashboardUrl } from '@/lib/utils'

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

  const [trpcClient] = useState(() =>
    createClient({
      baseUrl: getDashboardUrl(),
      useStreaming: env.VITE_TRPC_USE_STREAMING === 'true',
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <SessionProvider getUserFn={trpcClient.auth.currentUser.query}>
          {children}
        </SessionProvider>
      </TRPCProvider>
    </QueryClientProvider>
  )
}

export { TRPCReactProvider, useTRPC, useTRPCClient }
