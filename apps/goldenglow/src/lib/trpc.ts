import {
  createTRPCClient,
  httpBatchStreamLink,
  httpSubscriptionLink,
  splitLink,
} from '@trpc/client'
import SuperJSON from 'superjson'

import type { AppRouter } from '@yuki/api'

export const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      false: httpBatchStreamLink({
        transformer: SuperJSON,
        url: getBaseUrl() + '/api/trpc',
        headers() {
          const headers = new Headers()
          headers.set('x-trpc-source', 'vue')
          return headers
        },
      }),
      true: httpSubscriptionLink({
        transformer: SuperJSON,
        url: getBaseUrl() + '/api/trpc',
        eventSourceOptions() {
          const headers = new Headers()
          headers.set('x-trpc-source', 'vue')
          return { headers }
        },
      }),
    }),
  ],
})

function getBaseUrl(): string {
  return `http://localhost:3000`
}
