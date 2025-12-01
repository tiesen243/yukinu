import { ProductValidators } from '@yukinu/validators/product'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/trpc'

export const productRouter = createTRPCRouter({
  all: publicProcedure
    .meta({ message: 'Products fetched successfully' })
    .input(ProductValidators.allInput)
    .output(ProductValidators.allOutput)
    .query(({ ctx, input }) => ctx.services.product.all(input)),

  one: publicProcedure
    .meta({ message: 'Product fetched successfully' })
    .input(ProductValidators.oneInput)
    .output(ProductValidators.oneOutput)
    .query(({ ctx, input }) => ctx.services.product.one(input)),

  create: protectedProcedure
    .meta({
      message: 'Product created successfully',
      role: ['vendor_owner', 'vendor_staff'],
    })
    .input(ProductValidators.createInput)
    .output(ProductValidators.createOutput)
    .mutation(({ ctx, input }) => ctx.services.product.create(input)),

  update: protectedProcedure
    .meta({
      message: 'Product updated successfully',
      role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
    })
    .input(ProductValidators.updateInput)
    .output(ProductValidators.updateOutput)
    .mutation(({ ctx, input }) => ctx.services.product.update(input)),

  delete: protectedProcedure
    .meta({
      message: 'Product deleted successfully',
      role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
    })
    .input(ProductValidators.deleteInput)
    .output(ProductValidators.deleteOutput)
    .mutation(({ ctx, input }) => ctx.services.product.delete(input)),
})
