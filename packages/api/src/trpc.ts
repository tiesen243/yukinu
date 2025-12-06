import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'

import { validateAccessToken } from '@yukinu/auth'
import { db, orm } from '@yukinu/db'
import * as schema from '@yukinu/db/schema'
import { TokenBucketRateLimit } from '@yukinu/lib/rate-limit'

import type { TRPCContext, TRPCMeta } from '@/types'
import { AuthService } from '@/services/auth.service'
import { CategoryService } from '@/services/category.service'
import { ProductService } from '@/services/product.service'
import { UserService } from '@/services/user.service'
import { VendorService } from '@/services/vendor.service'

const createTRPCContext = async (opts: {
  headers: Headers
}): Promise<TRPCContext> => {
  const session = await validateAccessToken(opts.headers)

  const authService = new AuthService(db, orm, schema)
  const categoryService = new CategoryService(db, orm, schema)
  const productService = new ProductService(db, orm, schema)
  const userService = new UserService(db, orm, schema)
  const vendorService = new VendorService(db, orm, schema)

  return {
    headers: opts.headers,
    session,
    services: {
      auth: authService,
      category: categoryService,
      product: productService,
      user: userService,
      vendor: vendorService,
    },
  }
}

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

const bucket = new TokenBucketRateLimit<string>(10, 60)
const rateLimitMiddleware = t.middleware(async ({ ctx, next }) => {
  const identifier =
    ctx.session?.userId ??
    ctx.headers.get('x-forwarded-for') ??
    ctx.headers.get('x-real-ip') ??
    'unknown'

  if (!bucket.consume(identifier, 1))
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded',
    })

  return next()
})

const loggingMiddleware = t.middleware(
  async ({ ctx, next, type, path, meta }) => {
    console.log(
      '[tRPC] >>> Request from',
      ctx.headers.get('x-trpc-source') ?? 'unknown',
      `by ${ctx.session?.userId ?? 'guest'}`,
      `at ${path}`,
      `on ${new Date().toISOString()}`,
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

const publicProcedure = t.procedure
  .use(loggingMiddleware)
  .use(rateLimitMiddleware)
const protectedProcedure = publicProcedure.use(({ ctx, meta, next }) => {
  if (!ctx.session?.userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

  if (meta?.role?.length && !meta.role.includes(ctx.session.role)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have permission to perform this action.',
    })
  }

  return next({ ctx: { session: ctx.session } })
})

const vendorProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  let vendorId: string

  if (ctx.session.role === 'vendor_owner') {
    const [vendor] = await db
      .select({ id: schema.vendors.id })
      .from(schema.vendors)
      .where(orm.eq(schema.vendors.ownerId, ctx.session.userId))
      .limit(1)
    if (!vendor)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Vendor not found for the owner.',
      })
    vendorId = vendor.id
  } else if (ctx.session.role === 'vendor_staff') {
    const [staff] = await db
      .select({ vendorId: schema.vendorStaffs.vendorId })
      .from(schema.vendorStaffs)
      .where(orm.eq(schema.vendorStaffs.userId, ctx.session.userId))
      .limit(1)
    if (!staff)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Vendor not found for the staff.',
      })
    vendorId = staff.vendorId
  } else if (['admin', 'moderator'].includes(ctx.session.role)) {
    vendorId = 'admin-or-moderator-access'
  } else {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only vendor owners and staff can access this resource.',
    })
  }

  return next({ ctx: { session: ctx.session, vendorId } })
})

export type { TRPCMeta, TRPCContext }
export const MINMOD_ACCESS = 'admin-or-moderator-access'
export {
  createCallerFactory,
  createTRPCContext,
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  vendorProcedure,
}
