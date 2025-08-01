import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { appRouter } from './routers/_app'
import { createCallerFactory, createTRPCContext } from './trpc'

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
      responseMeta(opts) {
        const { errors, type } = opts
        const ONE_DAY_IN_SECONDS = 60 * 60 * 24

        if (errors.length === 0 && type === 'query')
          return {
            headers: new Headers([
              [
                'cache-control',
                `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
              ],
            ]),
          }
        return {}
      },
    })

  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Request-Method', '*')
  response.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  response.headers.set('Access-Control-Allow-Headers', '*')
  return response
}

export type { AppRouter, RouterInputs, RouterOutputs } from './routers/_app'
export { appRouter, createCallerFactory, createTRPCContext, handler }
