import {
  createTRPCClient,
  httpBatchLink,
  httpBatchStreamLink,
  retryLink,
  splitLink,
} from '@trpc/client'
import SuperJSON from 'superjson'

import type { AppRouter } from '@yukinu/api'
import { env } from '@yukinu/validators/env.vite'

import { getDashboardUrl } from '@/lib/utils'

const configs = {
  transformer: SuperJSON,
  url: getDashboardUrl() + '/api/trpc',
  headers() {
    const headers = new Headers()
    headers.set('x-trpc-source', 'web')
    return headers
  },
}

export const createClient = () =>
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
  })
