import {
  createTRPCProxyClient,
  httpBatchStreamLink,
  retryLink,
} from '@trpc/client'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { db } from '@yukinu/db'
import { transformer } from '@yukinu/lib/transformer'

import type { AppRouter } from '@/app'

import { createApp } from '@/app'
import { createCallerFactory, createTRPCContext } from '@/trpc'

const handler = async (request: Request): Promise<Response> => {
  const appRouter = createApp(db)

  const response =
    request.method === 'OPTIONS'
      ? new Response(null, { status: 204 })
      : await fetchRequestHandler<AppRouter>({
          endpoint: '/api/trpc',
          req: request,
          router: appRouter,
          createContext: ({ resHeaders }) =>
            createTRPCContext({ reqHeaders: request.headers, resHeaders }),
        })

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Request-Method', '*')
  response.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  response.headers.set('Access-Control-Allow-Headers', '*')
  return response
}

const createTRPCCaller = createCallerFactory(createApp(db))
const createTRPCClient = (source: string, baseUrl: string) =>
  createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchStreamLink({
        transformer,
        url: `${baseUrl}/api/trpc`,
        headers: {
          'x-trpc-source': source,
        },
      }),
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
    ],
  })

export type { AppRouter, RouterInputs, RouterOutputs } from '@/app'
export { createTRPCCaller, createTRPCClient, createTRPCContext, handler }

export default {
  fetch: handler,
}
