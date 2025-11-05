import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { createTRPCContext } from '@/context'
import { appRouter } from '@/routers/_app'
import { createCallerFactory } from '@/trpc'

const handler = async (request: Request) => {
  let response: Response

  if (request.method === 'OPTIONS')
    response = new Response(null, { status: 204 })
  else
    response = await fetchRequestHandler({
      endpoint: '/api/trpc',
      req: request,
      router: appRouter,
      createContext: () => createTRPCContext(request),
    })

  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Request-Method', '*')
  response.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  response.headers.set('Access-Control-Allow-Headers', '*')
  return response
}

const createCaller = createCallerFactory(appRouter)

export type * from '@/types'
export { appRouter, createCaller, createTRPCContext, handler }
