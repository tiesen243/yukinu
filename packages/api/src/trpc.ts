import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'

import { auth, validateSessionToken } from '@yuki/auth'
import { db } from '@yuki/db'

const isomorphicGetSession = async (headers: Headers) => {
  const authToken = headers.get('Authorization') ?? null
  if (authToken) return validateSessionToken(authToken)
  return auth({ headers })
}

const createTRPCContext = async (opts: Request) => {
  const session = await isomorphicGetSession(opts.headers)

  console.log(
    '>>> tRPC Request from',
    opts.headers.get('x-trpc-source') ?? 'unknown',
    'by',
    session?.user?.name ?? 'anonymous',
  )

  return {
    req: opts,
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

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()
  const result = await next()
  const end = Date.now()
  console.log(`[tRPC] ${path} took ${end - start}ms to execute`)
  return result
})

const publicProcedure = t.procedure.use(timingMiddleware)
const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
    return next({
      ctx: {
        session: {
          ...ctx.session,
          user: ctx.session.user,
        },
      },
    })
  })
const sellerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role === 'user')
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Seller access required',
    })
  return next()
})
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== 'admin')
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' })
  return next()
})

export {
  createCallerFactory,
  createTRPCContext,
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  sellerProcedure,
  adminProcedure,
}
