import { ProductValidators } from '@yukinu/validators/product'

import { createTRPCRouter, publicProcedure, vendorProcedure } from '@/trpc'

export const productRouter = createTRPCRouter({
  all: publicProcedure
    .meta({ message: 'Products fetched successfully' })
    .input(ProductValidators.allInput)
    .output(ProductValidators.allOutput)
    .query(({ ctx, input }) => ctx.services.product.all(input)),

  allByVendor: vendorProcedure
    .meta({
      message: 'Vendor products fetched successfully',
      role: ['vendor_owner', 'vendor_staff'],
    })
    .input(ProductValidators.allInput)
    .output(ProductValidators.allOutput)
    .query(({ ctx, input }) =>
      ctx.services.product.all({ ...input, vendorId: ctx.vendorId }),
    ),

  one: publicProcedure
    .meta({ message: 'Product fetched successfully' })
    .input(ProductValidators.oneInput)
    .output(ProductValidators.oneOutput)
    .query(({ ctx, input }) => ctx.services.product.one(input)),

  create: vendorProcedure
    .meta({
      message: 'Product created successfully',
      role: ['vendor_owner', 'vendor_staff'],
    })
    .input(ProductValidators.createInput.omit({ vendorId: true }))
    .output(ProductValidators.createOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.product.create({ ...input, vendorId: ctx.vendorId }),
    ),

  update: vendorProcedure
    .meta({
      message: 'Product updated successfully',
      role: ['vendor_owner', 'vendor_staff'],
    })
    .input(ProductValidators.updateInput.omit({ vendorId: true }))
    .output(ProductValidators.updateOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.product.update({ ...input, vendorId: ctx.vendorId }),
    ),

  delete: vendorProcedure
    .meta({
      message: 'Product deleted successfully',
      role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
    })
    .input(ProductValidators.deleteInput.omit({ vendorId: true }))
    .output(ProductValidators.deleteOutput)
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
    .input(ProductValidators.restoreInput.omit({ vendorId: true }))
    .output(ProductValidators.restoreOutput)
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
    .input(ProductValidators.permanentlyDeleteInput.omit({ vendorId: true }))
    .output(ProductValidators.permanentlyDeleteOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.product.permanentlyDelete({
        ...input,
        vendorId: ctx.vendorId,
      }),
    ),

  recreateVariant: vendorProcedure
    .meta({
      message: 'Product variants recreated successfully',
      role: ['vendor_owner', 'vendor_staff'],
    })
    .input(ProductValidators.recreateVariantInput.omit({ vendorId: true }))
    .output(ProductValidators.recreateVariantOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.product.recreateVariant({
        ...input,
        vendorId: ctx.vendorId,
      }),
    ),

  updateVariant: vendorProcedure
    .meta({
      message: 'Product variant updated successfully',
      role: ['vendor_owner', 'vendor_staff'],
    })
    .input(ProductValidators.updateVariantInput.omit({ vendorId: true }))
    .output(ProductValidators.updateVariantOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.product.updateVariant({
        ...input,
        vendorId: ctx.vendorId,
      }),
    ),

  deleteVariant: vendorProcedure
    .meta({
      message: 'Product variant deleted successfully',
      role: ['vendor_owner', 'vendor_staff'],
    })
    .input(ProductValidators.deleteVariantInput.omit({ vendorId: true }))
    .output(ProductValidators.deleteVariantOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.product.deleteVariant({
        ...input,
        vendorId: ctx.vendorId,
      }),
    ),
})
