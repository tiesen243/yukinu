import type { QueryClient } from '@tanstack/react-query'
import type { AppRouter } from '@yukinu/api'

import { createTRPCClient, httpBatchLink, retryLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import SuperJSON from 'superjson'

import { getAccessToken, getSessionToken } from '@/lib/secure-store'
import { getBaseUrl } from '@/lib/utils'

let clientQueryClientSingleton: QueryClient | undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  return (clientQueryClientSingleton ??= createQueryClient())
}

const queryClient = getQueryClient()

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    retryLink({
      retry: ({ op, error, attempts }) => {
        if (error.data?.code === 'UNAUTHORIZED') {
          if (attempts > 1) return false // Do not retry more than once for unauthorized errors

          fetch(`${getBaseUrl()}/api/auth/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getSessionToken()}`,
            },
          })

          return true // Retry once after attempting to refresh the token
        }

        if (
          op.type !== 'query' ||
          [
            'FORBIDDEN',
            'INTERNAL_SERVER_ERROR',
            'NOT_FOUND',
            'TOO_MANY_REQUESTS',
          ].includes(error.data?.code ?? '') ||
          error.message === 'Network request failed'
        )
          return false // Do not retry for these cases

        return attempts <= 3 // Retry up to 3 times for other errors
      },
      retryDelayMs: (attempts) => Math.min(1000 * 2 ** attempts, 30000),
    }),
    httpBatchLink({
      transformer: SuperJSON,
      url: getBaseUrl() + '/api/trpc',
      headers() {
        const headers = new Map<string, string>([['x-trpc-source', 'mobile']])

        if (getAccessToken())
          headers.set('Authorization', `Bearer ${getAccessToken()}`)

        return headers
      },
    }),
  ],
})

const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
})

export { trpc, trpcClient, queryClient }
