import {
  createTRPCClient,
  httpBatchLink,
  httpBatchStreamLink,
  retryLink,
  splitLink,
} from '@trpc/client'
import { SuperJSON } from 'superjson'

import type { AppRouter } from '@/routers/_app'

export interface CreateClientOptions {
  baseUrl: string
  useStreaming: boolean
}

export const createClient = ({
  baseUrl,
  useStreaming,
}: CreateClientOptions) => {
  const configs = {
    transformer: SuperJSON,
    url: `${baseUrl}/api/trpc`,
    headers() {
      const headers = new Headers()
      headers.set('x-trpc-source', 'web')
      return headers
    },
  }

  return createTRPCClient<AppRouter>({
    links: [
      retryLink({
        retry: ({ op, error, attempts }) => {
          if (error.data?.code === 'UNAUTHORIZED') {
            if (attempts > 1) return false // Only attempt to refresh the token once
            fetch(`${baseUrl}/api/auth/refresh-token`, { method: 'POST' })
            return true // Retry after refreshing the token
          }

          if (
            op.type !== 'query' ||
            [
              'FORBIDDEN',
              'INTERNAL_SERVER_ERROR',
              'TOO_MANY_REQUESTS',
            ].includes(error.data?.code ?? '')
          )
            return false // Do not retry on specific errors

          return attempts <= 3 // Retry up to 3 times for other errors
        },
        retryDelayMs: (attempts) => Math.min(1000 * 2 ** attempts, 30_000),
      }),
      splitLink({
        condition: () => useStreaming,
        true: httpBatchStreamLink(configs),
        false: httpBatchLink(configs),
      }),
    ],
  })
}
