import type { userRoleEnum } from '@yukinu/db/schema'

import { initTRPC, TRPCError } from '@trpc/server'
import { verifyAccessToken } from '@yukinu/auth'
import { transformer } from '@yukinu/lib/transformer'

export interface TRPCMeta {
  message?: string
  role?: (typeof userRoleEnum)['enumValues'][number][]
}

export interface TRPCContext {
  req: Request
  resHeaders: Headers
}

const t = initTRPC
  .meta<TRPCMeta>()
  .context<TRPCContext>()
  .create({ transformer })

const createTRPCRouter = t.router

const { createCallerFactory, mergeRouters } = t

const publicProcedure = t.procedure.use(
  t.middleware(async ({ path, type, meta, next }) => {
    const start = performance.now()
    const result = await next()
    const end = performance.now()

    console.log(
      `[${type}] ${path} took ${(end - start).toFixed(2)}ms`,
      meta?.message ? `- ${meta.message}` : '',
    )

    return result
  }),
)

const protectedProcedure = publicProcedure.use(
  t.middleware(async ({ ctx, meta, next }) => {
    const session = await verifyAccessToken(ctx.req)
    if (!session?.userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

    if (meta?.role && !meta.role.includes(session.role))
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Insufficient permissions',
      })

    return next({ ctx: { ...ctx, session } })
  }),
)

export {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  mergeRouters,
}
