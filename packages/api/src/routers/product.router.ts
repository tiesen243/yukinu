import { ProductModels } from '@yukinu/validators/product'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/trpc'

export const productRouter = createTRPCRouter({
  all: publicProcedure
    .meta({ message: 'Fetch all products successfully' })
    .input(ProductModels.allInput)
    .output(ProductModels.allOutput)
    .query(({ ctx, input }) => ctx.productService.all(input)),

  create: protectedProcedure
    .meta({
      message: 'Product created successfully',
      roles: ['vendor_owner', 'vendor_staff'],
    })
    .input(ProductModels.createInput)
    .output(ProductModels.createOutput)
    .mutation(({ ctx, input }) => ctx.productService.create(input)),
})
