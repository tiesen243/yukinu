import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'

import { auth, validateSessionToken } from '@yukinu/auth'
import { db } from '@yukinu/db'

import { assignServices } from './services'

const isomorphicGetSession = async (headers: Headers) => {
  const authToken = headers.get('Authorization') ?? null
  if (authToken) return validateSessionToken(authToken)
  return auth({ headers } as Request)
}

const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await isomorphicGetSession(opts.headers)

  console.log(
    '>>> tRPC Request from',
    opts.headers.get('x-trpc-source') ?? 'unknown',
    'by',
    session?.user?.username ?? 'anonymous',
  )

  return {
    db,
    session,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON,
  sse: {
    maxDurationMs: 1_000 * 60 * 5, // 5 minutes
    ping: { enabled: true, intervalMs: 3_000 },
    client: { reconnectAfterInactivityMs: 5_000 },
  },
})

const createCallerFactory = t.createCallerFactory

const createTRPCRouter = t.router

const createTRPCMiddleware = t.middleware

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()
  const result = await next()
  const end = Date.now()
  console.log(`[tRPC] ${path} took ${end - start}ms to execute`)
  return result
})

const publicProcedure = t.procedure.use(timingMiddleware).use(assignServices)
const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(assignServices)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== 'admin')
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access only' })
  return next()
})

export {
  createCallerFactory,
  createTRPCContext,
  createTRPCRouter,
  createTRPCMiddleware,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
}
