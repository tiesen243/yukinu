import { VendorValidator } from '@yukinu/validators/vendor'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const vendorRouter = createTRPCRouter({
  all: protectedProcedure
    .meta({
      message: 'Vendors retrieved successfully',
      roles: ['admin', 'moderator'],
    })
    .input(VendorValidator.allParams)
    .query(({ ctx, input }) => ctx.vendorService.all(input)),

  register: protectedProcedure
    .meta({ message: 'Vendor registered successfully' })
    .input(VendorValidator.registerBody)
    .mutation(({ ctx, input }) =>
      ctx.vendorService.register({ ...input, ownerId: ctx.session.user.id }),
    ),

  update: protectedProcedure
    .meta({
      message: 'Vendor approved successfully',
      roles: ['admin', 'moderator'],
    })
    .input(VendorValidator.updateBody)
    .mutation(({ ctx, input }) => ctx.vendorService.update(input)),

  delete: protectedProcedure
    .meta({
      message: 'Vendor deleted successfully',
      roles: ['admin', 'moderator'],
    })
    .input(VendorValidator.oneParams)
    .mutation(({ ctx, input }) => ctx.vendorService.delete(input)),

  invite: protectedProcedure
    .meta({
      message: 'Vendor invitation sent successfully',
      roles: ['admin', 'moderator', 'vendor_owner'],
    })
    .input(VendorValidator.inviteBody)
    .mutation(({ ctx, input }) => ctx.vendorService.inviteMember(input)),
})
