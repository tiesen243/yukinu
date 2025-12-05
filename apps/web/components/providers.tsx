'use client'

import type { QueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  createTRPCClient,
  httpBatchLink,
  httpBatchStreamLink,
  retryLink,
  splitLink,
} from '@trpc/client'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import SuperJSON from 'superjson'

import type { AppRouter } from '@yukinu/api'
import { SessionProvider } from '@yukinu/auth/react'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import { ThemeProvider } from '@yukinu/ui'
import { env } from '@yukinu/validators/env.next'

import { TRPCProvider } from '@/lib/trpc/react'
import { getWebUrl } from '@/lib/utils'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  else return (clientQueryClientSingleton ??= createQueryClient())
}

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  const configs = {
    transformer: SuperJSON,
    url: getWebUrl() + '/api/trpc',
    headers() {
      const headers = new Headers()
      headers.set('x-trpc-source', 'web')
      return headers
    },
  }

  // eslint-disable-next-line @eslint-react/naming-convention/use-state
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        retryLink({
          retry: ({ error, attempts }) => {
            if (error.data?.code === 'UNAUTHORIZED' && attempts < 2) {
              void fetch('/api/auth/refresh-token', { method: 'POST' })
              return true
            }

            return false
          },
          retryDelayMs: (attempts) => Math.min(1000 * 2 ** attempts, 30000),
        }),
        splitLink({
          condition: () => env.NEXT_PUBLIC_TRPC_USE_STREAMING === 'true',
          true: httpBatchStreamLink(configs),
          false: httpBatchLink(configs),
        }),
      ],
    }),
  )

  return (
    <ThemeProvider attribute='class' disableTransitionOnChange enableSystem>
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <SessionProvider getSessionFn={trpcClient.auth.getCurrentUser.query}>
            <NuqsAdapter>{children}</NuqsAdapter>
          </SessionProvider>
        </TRPCProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
