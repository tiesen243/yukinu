import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { env } from '@yukinu/validators/env'

import { createTRPCContext } from './context'
import { appRouter } from './routers/_app'
import { createCallerFactory } from './trpc'

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

  const protocal = env.NODE_ENV === 'production' ? 'https' : 'http'
  const allowedOrigins = [
    `${protocal}://${env.NEXT_PUBLIC_DASHBOARD_URL}`,
    `${protocal}://${env.NEXT_PUBLIC_WEB_URL}`,
  ]

  response.headers.set('Access-Control-Allow-Origin', allowedOrigins.join(', '))
  response.headers.set('Access-Control-Request-Method', '*')
  response.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  response.headers.set('Access-Control-Allow-Headers', '*')
  return response
}

export type * from './context'
export type { AppRouter, RouterInputs, RouterOutputs } from './routers/_app'
export { appRouter, createCallerFactory, createTRPCContext, handler }
