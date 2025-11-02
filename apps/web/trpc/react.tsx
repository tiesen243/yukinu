'use client'

import type { QueryClient } from '@tanstack/react-query'
import type { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import * as React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  createTRPCClient,
  httpBatchLink,
  httpBatchStreamLink,
} from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import SuperJSON from 'superjson'

import type { AppRouter } from '@yukinu/api'
import { env } from '@yukinu/validators/env'

import { getBaseUrl } from '@/lib/utils'
import { createQueryClient } from '@/trpc/query-client'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  else return (clientQueryClientSingleton ??= createQueryClient())
}

const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>() as {
    TRPCProvider: React.FC<
      Readonly<{
        children: React.ReactNode
        queryClient: QueryClient
        trpcClient: ReturnType<typeof createTRPCClient<AppRouter>>
      }>
    >
    useTRPC: () => ReturnType<typeof createTRPCOptionsProxy<AppRouter>>
    useTRPCClient: () => ReturnType<typeof createTRPCClient<AppRouter>>
  }

function TRPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  const configs = {
    transformer: SuperJSON,
    url: getBaseUrl() + '/api/trpc',
    headers() {
      const headers = new Headers()
      headers.set('x-trpc-source', 'web')
      return headers
    },
  }

  // eslint-disable-next-line @eslint-react/naming-convention/use-state
  const [trpcClient] = React.useState(() =>
    createTRPCClient<AppRouter>({
      links:
        env.NEXT_PUBLIC_TRPC_USE_STREAMING === 'true'
          ? [httpBatchStreamLink(configs)]
          : [httpBatchLink(configs)],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}

export { TRPCReactProvider, useTRPC, useTRPCClient }
