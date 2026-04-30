import type { Database } from '@yukinu/db/drizzle'
import type { userRoleEnum } from '@yukinu/db/schema'

import { initTRPC, TRPCError } from '@trpc/server'
import { verifyAccessToken } from '@yukinu/auth'
import { db } from '@yukinu/db'
import { transformer } from '@yukinu/lib/transformer'

export interface TRPCMeta {
  role?: (typeof userRoleEnum)['enumValues'][number][]
}

export interface TRPCContext {
  req: Request
  resHeaders: Headers

  db: Database
  session: Awaited<ReturnType<typeof verifyAccessToken>>
}

const t = initTRPC
  .meta<TRPCMeta>()
  .context<TRPCContext>()
  .create({ transformer })

const createTRPCContext = async (
  opts: Omit<TRPCContext, 'db' | 'session'>,
) => ({
  ...opts,
  db,
  session: await verifyAccessToken(opts.req),
})

const createTRPCRouter = t.router

const createTRPCMiddleware = t.middleware

const { createCallerFactory, mergeRouters } = t

const publicProcedure = t.procedure.use(
  t.middleware(async ({ path, type, next }) => {
    const start = performance.now()
    const result = await next()

    const end = performance.now()
    console.log(`[${type}] ${path} took ${(end - start).toFixed(2)}ms`)

    return result
  }),
)

const protectedProcedure = publicProcedure.use(
  t.middleware(({ ctx, meta, next }) => {
    if (!ctx.session?.userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

    if (meta?.role && !meta.role.includes(ctx.session.role))
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Insufficient permissions',
      })

    return next({ ctx: { ...ctx, session: ctx.session } })
  }),
)

export {
  createCallerFactory,
  createTRPCContext,
  createTRPCRouter,
  createTRPCMiddleware,
  publicProcedure,
  protectedProcedure,
  mergeRouters,
}
