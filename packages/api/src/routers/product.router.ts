import { ProductModels } from '@yukinu/validators/product'

import { createTRPCRouter, publicProcedure, vendorProcedure } from '@/trpc'

export const productRouter = createTRPCRouter({
  all: publicProcedure
    .meta({ message: 'Fetch all products successfully' })
    .input(ProductModels.allInput.omit({ vendorId: true }))
    .output(ProductModels.allOutput)
    .query(({ ctx, input }) => ctx.productService.all(input)),

  allByVendor: vendorProcedure
    .meta({
      message: 'Fetch all products by vendor successfully',
      roles: ['vendor_owner', 'vendor_staff'],
    })
    .input(ProductModels.allInput.omit({ vendorId: true }))
    .output(ProductModels.allOutput)
    .query(({ ctx, input }) =>
      ctx.productService.all({ ...input, vendorId: ctx.vendor.id }),
    ),

  create: vendorProcedure
    .meta({
      message: 'Product created successfully',
      roles: ['vendor_owner', 'vendor_staff'],
    })
    .input(ProductModels.createInput.omit({ vendorId: true }))
    .output(ProductModels.createOutput)
    .mutation(({ ctx, input }) =>
      ctx.productService.create({ ...input, vendorId: ctx.vendor.id }),
    ),
})
