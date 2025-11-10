import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'

import { TokenBucketRateLimit } from '@yukinu/auth'

import type { TRPCContext, TRPCMeta } from '@/types'

const t = initTRPC
  .meta<TRPCMeta>()
  .context<TRPCContext>()
  .create({
    transformer: SuperJSON,
    errorFormatter({ type, path, shape }) {
      if (shape.message !== `No procedure found on path "${path}"`)
        console.error(
          `[tRPC] <<< [${type}] ${path} ${shape.data.httpStatus}: ${shape.message}`,
        )

      if (shape.message.startsWith('Failed query: '))
        shape.message =
          'An error occurred. Please try again later or contact the administrator.'
      return shape
    },
  })

const createCallerFactory = t.createCallerFactory

const createTRPCRouter = t.router

const loggingMiddleware = t.middleware(
  async ({ ctx, next, type, path, meta }) => {
    console.log(
      '[tRPC] >>> Request from',
      ctx.headers.get('x-trpc-source') ?? 'unknown',
      'by',
      ctx.session?.user?.id ?? 'guest',
      `at ${path}`,
    )

    const start = performance.now()
    const result = await next()
    const end = performance.now()
    console.log(`[tRPC] took ${(end - start).toFixed(2)}ms to execute`)

    if (result.ok) {
      const codeMap = { query: 200, mutation: 201, subscription: 200 } as const
      console.log(
        `[tRPC] <<< [${type}] ${path} ${codeMap[type]}: ${meta?.message ?? 'Success'}`,
      )
    }

    return result
  },
)

const ratelimiters = new TokenBucketRateLimit<string>(50, 60)
const ratelimitConsume = { query: 1, mutation: 5, subscription: 1 } as const
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

const authMiddleware = t.middleware(({ meta, ctx, next }) => {
  if (!ctx.session?.user)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not authenticated',
    })

  if (
    meta?.roles &&
    meta.roles.length > 0 &&
    !meta.roles.includes(ctx.session.user.role)
  )
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'User does not have sufficient permissions',
    })

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

const publicProcedure = t.procedure
  .use(loggingMiddleware)
  .use(rateLimitMiddleware)

const protectedProcedure = t.procedure
  .use(loggingMiddleware)
  .use(rateLimitMiddleware)
  .use(authMiddleware)

export {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
}
