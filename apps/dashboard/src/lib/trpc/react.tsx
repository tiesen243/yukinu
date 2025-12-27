import type { QueryClient } from '@tanstack/react-query'
import type { AppRouter } from '@yukinu/api'

import { QueryClientProvider } from '@tanstack/react-query'
import {
  createTRPCClient,
  retryLink,
  splitLink,
  httpBatchStreamLink,
  httpBatchLink,
} from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import { SessionProvider } from '@yukinu/auth/react'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import { env } from '@yukinu/validators/env.vite'
import { useState } from 'react'
import SuperJSON from 'superjson'

import { getDashboardUrl } from '@/lib/utils'

const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>()

let clientQueryClientSingleton: QueryClient | undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  return (clientQueryClientSingleton ??= createQueryClient())
}

const configs = {
  transformer: SuperJSON,
  url: getDashboardUrl() + '/api/trpc',
  headers() {
    const headers = new Headers()
    headers.set('x-trpc-source', 'web')
    return headers
  },
}

function TRPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        retryLink({
          retry: ({ error, attempts }) => {
            if (error.data?.code === 'UNAUTHORIZED' && attempts < 2) {
              void fetch(`${getDashboardUrl()}/api/auth/refresh-token`, {
                method: 'POST',
              })
              return true
            }
            return false
          },
          retryDelayMs: (attempts) => Math.min(1000 * 2 ** attempts, 30000),
        }),
        splitLink({
          condition: () => env.VITE_TRPC_USE_STREAMING === 'true',
          true: httpBatchStreamLink(configs),
          false: httpBatchLink(configs),
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <SessionProvider getSessionFn={trpcClient.auth.getCurrentUser.query}>
          {children}
        </SessionProvider>
      </TRPCProvider>
    </QueryClientProvider>
  )
}

export { TRPCReactProvider, useTRPC, useTRPCClient }
