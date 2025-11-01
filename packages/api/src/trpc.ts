import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'

import type { Session } from '@yukinu/auth'
import { TokenBucketRateLimit } from '@yukinu/auth/rate-limit'

import type { IAuthService } from './contracts/services/auth.service'
import type { IUserService } from './contracts/services/user.service'

interface TRPCContext {
  headers: Headers
  session: Omit<Session, 'token'> | null

  authService: IAuthService
  userService: IUserService
}

const t = initTRPC.context<TRPCContext>().create({
  transformer: SuperJSON,
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
  if (!['admin', 'moderator'].includes(ctx.session.user.role))
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'User does not have sufficient permissions',
    })
  return next()
})

export type { TRPCContext }
export {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  managerProcedure,
}
