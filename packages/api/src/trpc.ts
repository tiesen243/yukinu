import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'

import { TokenBucketRateLimit } from '@yukinu/auth/rate-limit'

import type { createTRPCContext } from './context'

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

const ratelimiters = new TokenBucketRateLimit<string>(50, 60)
const ratelimitConsume = {
  query: 1,
  mutation: 5,
  subscription: 1,
} as const

const rateLimitMiddleware = t.middleware(async ({ ctx, type, next }) => {
  const ip =
    ctx.headers.get('x-forwarded-for') ??
    ctx.headers.get('x-real-ip') ??
    'unknown'

  const key = `${ctx.session?.user?.id ?? 'unknown'}:${ip.split(',').at(0)?.trim() ?? 'unknown'}`
  const allowed = ratelimiters.consume(key, ratelimitConsume[type])
  if (!allowed)
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded',
    })
  return next()
})

const publicProcedure = t.procedure
  .use(timingMiddleware)
  .use(rateLimitMiddleware)
const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(rateLimitMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not authenticated',
      })
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })
const managerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== 'admin' && ctx.session.user.role !== 'manager')
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin or manager access only',
    })
  return next()
})

export {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  managerProcedure,
}
