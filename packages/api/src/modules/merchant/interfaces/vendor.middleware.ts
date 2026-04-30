import { TRPCError } from '@trpc/server'
import { eq } from '@yukinu/db/drizzle'
import { vendors, vendorStaffs } from '@yukinu/db/schema'

import { createTRPCMiddleware } from '@/trpc'

export const vendorMiddleware = createTRPCMiddleware(async ({ ctx, next }) => {
  if (!ctx.session?.userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

  if (!['vendor_owner', 'vendor_staff'].includes(ctx.session.role))
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Insufficient permissions',
    })

  let vendor
  if (ctx.session.role === 'vendor_owner')
    [vendor] = await ctx.db
      .select({ id: vendors.id })
      .from(vendors)
      .where(eq(vendors.ownerId, ctx.session.userId))
      .limit(1)
  else if (ctx.session.role === 'vendor_staff')
    [vendor] = await ctx.db
      .select({ id: vendors.id })
      .from(vendors)
      .innerJoin(vendorStaffs, eq(vendorStaffs.vendorId, vendors.id))
      .where(eq(vendorStaffs.userId, ctx.session.userId))
      .limit(1)

  if (!vendor)
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Vendor for user ID ${ctx.session.userId} not found`,
    })

  return next({
    ctx: {
      ...ctx,
      session: {
        ...ctx.session,
        vendorId: vendor.id,
      },
    },
  })
})
