import { createTRPCProxyClient, httpBatchStreamLink } from '@trpc/client'
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
            createTRPCContext({ req: request, resHeaders }),
        })

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Request-Method', '*')
  response.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  response.headers.set('Access-Control-Allow-Headers', '*')
  return response
}

const createTRPCCaller = createCallerFactory(createApp(db))
const createTRPCClient = (baseUrl: string) =>
  createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchStreamLink({
        transformer,
        url: `${baseUrl}/api/trpc`,
      }),
    ],
  })

export type { AppRouter, RouterInputs, RouterOutputs } from '@/app'
export { createTRPCCaller, createTRPCClient, handler }

export default {
  fetch: handler,
}
