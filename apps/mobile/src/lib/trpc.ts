import type { AppRouter } from '@yukinu/api'

import { createTRPCClient, httpBatchLink, retryLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { createQueryClient } from '@yukinu/lib/create-query-client'
import SuperJSON from 'superjson'

import { getAccessToken, getSessionToken, setAccessToken } from '@/lib/store'
import { getBaseUrl } from '@/lib/utils'

const queryClient = createQueryClient()

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    retryLink({
      retry: ({ error, attempts }) => {
        if (error.data?.code === 'UNAUTHORIZED') {
          fetch(`${getBaseUrl()}/api/auth/refresh-token`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${getSessionToken()}` },
          })
            .then((res) => res.json() as Promise<{ accessToken: string }>)
            .then(({ accessToken }) => setAccessToken(accessToken))
            .catch(() => {
              /* Ignore errors */
            })

          return true
        }

        return attempts <= 1
      },
      retryDelayMs: (attempts) => Math.min(1000 * 2 ** attempts, 30000),
    }),
    httpBatchLink({
      transformer: SuperJSON,
      url: getBaseUrl() + '/api/trpc',
      headers() {
        const headers = new Map<string, string>([['x-trpc-source', 'mobile']])

        const accessToken = getAccessToken()
        if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

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
