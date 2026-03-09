import type { AppRouter } from '@yukinu/api'

import {
  createTRPCClient,
  httpBatchLink,
  httpBatchStreamLink,
  retryLink,
  splitLink,
} from '@trpc/client'
import { env } from '@yukinu/validators/env.next'
import { SuperJSON } from 'superjson'

import { getWebUrl } from '@/lib/utils'

const configs = {
  transformer: SuperJSON,
  url: `${getWebUrl()}/api/trpc`,
  headers() {
    const headers = new Headers()
    headers.set('x-trpc-source', 'web')
    return headers
  },
}

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    retryLink({
      retry: ({ op, error, attempts }) => {
        if (error.data?.code === 'UNAUTHORIZED') {
          if (attempts > 1) return false // Only attempt to refresh the token once
          fetch(`${getWebUrl()}/api/auth/refresh-token`, { method: 'POST' })
          return true // Retry after refreshing the token
        }

        if (
          op.type !== 'query' ||
          error.message === 'Network request failed' ||
          ['FORBIDDEN', 'INTERNAL_SERVER_ERROR', 'TOO_MANY_REQUESTS'].includes(
            error.data?.code ?? '',
          )
        )
          return false // Do not retry on specific errors

        return attempts <= 3 // Retry up to 3 times for other errors
      },
      retryDelayMs: (attempts) => Math.min(1000 * 2 ** attempts, 30_000),
    }),
    splitLink({
      condition: () => env.NEXT_PUBLIC_TRPC_USE_STREAMING === 'true',
      true: httpBatchStreamLink(configs),
      false: httpBatchLink(configs),
    }),
  ],
})
