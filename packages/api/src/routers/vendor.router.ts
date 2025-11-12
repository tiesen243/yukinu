import { VendorModels } from '@yukinu/validators/vendor'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const vendorRouter = createTRPCRouter({
  all: protectedProcedure
    .meta({
      message: 'Vendors retrieved successfully',
      roles: ['admin', 'moderator'],
    })
    .input(VendorModels.allInput)
    .output(VendorModels.allOutput)
    .query(({ ctx, input }) => ctx.vendorService.all(input)),

  register: protectedProcedure
    .meta({ message: 'Vendor registered successfully', roles: ['user'] })
    .input(VendorModels.registerInput.omit({ userId: true }))
    .output(VendorModels.registerOutput)
    .mutation(({ ctx, input }) =>
      ctx.vendorService.register({ ...input, userId: ctx.session.user.id }),
    ),

  update: protectedProcedure
    .meta({
      message: 'Vendor updated successfully',
      roles: ['admin', 'moderator', 'vendor_owner'],
    })
    .input(VendorModels.updateInput)
    .output(VendorModels.updateOutput)
    .mutation(({ ctx, input }) =>
      ctx.vendorService.update(input, ctx.session.user),
    ),

  delete: protectedProcedure
    .meta({
      message: 'Vendor deleted successfully',
      roles: ['admin', 'moderator'],
    })
    .input(VendorModels.deleteInput)
    .output(VendorModels.deleteOutput)
    .mutation(({ ctx, input }) =>
      ctx.vendorService.delete(input, ctx.session.user),
    ),
})
