import * as Validators from '@yukinu/validators/product'

import { createTRPCRouter, vendorProcedure } from '@/trpc'

export const variantRouter = createTRPCRouter({
  recreate: vendorProcedure
    .meta({
      message: 'Product variants recreated successfully',
      role: ['vendor_owner', 'vendor_staff'],
    })
    .input(Validators.recreateVariantInput.omit({ vendorId: true }))
    .output(Validators.recreateVariantOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.productVariant.recreate({
        ...input,
        vendorId: ctx.vendorId,
      }),
    ),

  update: vendorProcedure
    .meta({
      message: 'Product variant updated successfully',
      role: ['vendor_owner', 'vendor_staff'],
    })
    .input(Validators.updateVariantInput.omit({ vendorId: true }))
    .output(Validators.updateVariantOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.productVariant.update({ ...input, vendorId: ctx.vendorId }),
    ),

  delete: vendorProcedure
    .meta({
      message: 'Product variant deleted successfully',
      role: ['vendor_owner', 'vendor_staff'],
    })
    .input(Validators.deleteVariantInput.omit({ vendorId: true }))
    .output(Validators.deleteVariantOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.productVariant.delete({ ...input, vendorId: ctx.vendorId }),
    ),
})
