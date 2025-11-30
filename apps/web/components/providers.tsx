'use client'

import type { QueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  createTRPCClient,
  httpBatchLink,
  httpBatchStreamLink,
  splitLink,
} from '@trpc/client'
import SuperJSON from 'superjson'

import type { AppRouter } from '@yukinu/api'
import { SessionProvider } from '@yukinu/auth/react'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import { ThemeProvider } from '@yukinu/ui'
import { env } from '@yukinu/validators/env.next'

import { TRPCProvider } from '@/lib/trpc/react'
import { getBaseUrl } from '@/lib/utils'

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
    url: getBaseUrl() + '/api/trpc',
    headers() {
      const headers = new Headers()
      headers.set('x-trpc-source', 'web')

      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth.access_token='))
        ?.split('=')[1]
      if (token) headers.set('Authorization', `Bearer ${token}`)

      return headers
    },
  }

  // eslint-disable-next-line @eslint-react/naming-convention/use-state
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
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
          <SessionProvider>{children}</SessionProvider>
        </TRPCProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
