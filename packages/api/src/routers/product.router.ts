import * as Validators from '@yukinu/validators/product'

import { createTRPCRouter, publicProcedure, vendorProcedure } from '@/trpc'

export const productRouter = createTRPCRouter({
  all: publicProcedure
    .meta({ message: 'Products fetched successfully' })
    .input(Validators.allInput)
    .output(Validators.allOutput)
    .query(({ ctx, input }) => ctx.services.product.all(input)),

  allByVendor: vendorProcedure
    .meta({
      message: 'Vendor products fetched successfully',
      role: ['vendor_owner', 'vendor_staff'],
    })
    .input(Validators.allInput)
    .output(Validators.allOutput)
    .query(({ ctx, input }) =>
      ctx.services.product.all({ ...input, vendorId: ctx.vendorId }),
    ),

  one: publicProcedure
    .meta({ message: 'Product fetched successfully' })
    .input(Validators.oneInput)
    .output(Validators.oneOutput)
    .query(({ ctx, input }) => ctx.services.product.one(input)),

  create: vendorProcedure
    .meta({
      message: 'Product created successfully',
      role: ['vendor_owner', 'vendor_staff'],
    })
    .input(Validators.createInput.omit({ vendorId: true }))
    .output(Validators.createOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.product.create({ ...input, vendorId: ctx.vendorId }),
    ),

  update: vendorProcedure
    .meta({
      message: 'Product updated successfully',
      role: ['vendor_owner', 'vendor_staff'],
    })
    .input(Validators.updateInput.omit({ vendorId: true }))
    .output(Validators.updateOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.product.update({ ...input, vendorId: ctx.vendorId }),
    ),

  delete: vendorProcedure
    .meta({
      message: 'Product deleted successfully',
      role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
    })
    .input(Validators.deleteInput.omit({ vendorId: true }))
    .output(Validators.deleteOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.product.delete({
        ...input,
        vendorId: ctx.vendorId,
      }),
    ),

  restore: vendorProcedure
    .meta({
      message: 'Product restored successfully',
      role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
    })
    .input(Validators.restoreInput.omit({ vendorId: true }))
    .output(Validators.restoreOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.product.restore({
        ...input,
        vendorId: ctx.vendorId,
      }),
    ),

  permanentDelete: vendorProcedure
    .meta({
      message: 'Product permanently deleted successfully',
      role: ['admin', 'moderator', 'vendor_owner'],
    })
    .input(Validators.permanentlyDeleteInput.omit({ vendorId: true }))
    .output(Validators.permanentlyDeleteOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.product.permanentlyDelete({
        ...input,
        vendorId: ctx.vendorId,
      }),
    ),
})
