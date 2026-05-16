import { TRPCError } from '@trpc/server'
import { eq } from '@yukinu/db/drizzle'
import { vendors, vendorStaffs } from '@yukinu/db/schema'

import { MINMOD_ACCESS } from '@/shared/constants'
import { createTRPCMiddleware } from '@/trpc'

export const vendorMiddleware = createTRPCMiddleware(async ({ ctx, next }) => {
  if (!ctx.session?.userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

  if (['admin', 'moderator'].includes(ctx.session.role))
    return next({
      ctx: {
        ...ctx,
        session: {
          ...ctx.session,
          vendorId: MINMOD_ACCESS,
        },
      },
    })

  if (!['vendor_owner', 'vendor_staff'].includes(ctx.session.role))
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Insufficient permissions',
    })

  let vendor
  if (ctx.session.role === 'vendor_owner')
    [vendor] = await ctx.db
      .select({ id: vendors.id, status: vendors.status })
      .from(vendors)
      .where(eq(vendors.ownerId, ctx.session.userId))
      .limit(1)
  else if (ctx.session.role === 'vendor_staff')
    [vendor] = await ctx.db
      .select({ id: vendors.id, status: vendors.status })
      .from(vendors)
      .innerJoin(vendorStaffs, eq(vendorStaffs.vendorId, vendors.id))
      .where(eq(vendorStaffs.userId, ctx.session.userId))
      .limit(1)

  if (!vendor)
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Vendor for user ID ${ctx.session.userId} not found`,
    })

  const forbiddenMessages: Record<string, string> = {
    pending: 'Vendor account is pending approval',
    rejected: 'Vendor account has been rejected',
    suspended: 'Vendor account has been suspended',
  }
  if (forbiddenMessages[vendor.status])
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: forbiddenMessages[vendor.status],
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

export type VendorMiddleware = typeof vendorMiddleware
