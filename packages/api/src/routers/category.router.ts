import { CategoryValidators } from '@yukinu/validators/category'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/trpc'

export const categoryRouter = createTRPCRouter({
  all: publicProcedure
    .meta({ message: 'Categories fetched successfully' })
    .input(CategoryValidators.allInput)
    .output(CategoryValidators.allOutput)
    .query(({ ctx, input }) => ctx.services.category.all(input)),

  one: publicProcedure
    .meta({ message: 'Category fetched successfully' })
    .input(CategoryValidators.oneInput)
    .output(CategoryValidators.oneOutput)
    .query(({ ctx, input }) => ctx.services.category.one(input)),

  create: protectedProcedure
    .meta({
      message: 'Category created successfully',
      role: ['admin', 'moderator'],
    })
    .input(CategoryValidators.createInput)
    .output(CategoryValidators.createOutput)
    .mutation(({ ctx, input }) => ctx.services.category.create(input)),

  update: protectedProcedure
    .meta({
      message: 'Category updated successfully',
      role: ['admin', 'moderator'],
    })
    .input(CategoryValidators.updateInput)
    .output(CategoryValidators.updateOutput)
    .mutation(({ ctx, input }) => ctx.services.category.update(input)),

  delete: protectedProcedure
    .meta({
      message: 'Category deleted successfully',
      role: ['admin', 'moderator'],
    })
    .input(CategoryValidators.deleteInput)
    .output(CategoryValidators.deleteOutput)
    .mutation(({ ctx, input }) => ctx.services.category.delete(input)),
})
