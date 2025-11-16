import { CategoryModels } from '@yukinu/validators/category'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/trpc'

export const categoryRouter = createTRPCRouter({
  all: publicProcedure
    .meta({ message: 'Fetched categories successfully' })
    .input(CategoryModels.allInput)
    .output(CategoryModels.allOutput)
    .query(({ ctx, input }) => ctx.categoryService.all(input)),

  one: publicProcedure
    .meta({ message: 'Fetch category successfully' })
    .input(CategoryModels.oneInput)
    .output(CategoryModels.oneOutput)
    .query(({ ctx, input }) => ctx.categoryService.one(input)),

  create: protectedProcedure
    .meta({
      roles: ['admin', 'moderator'],
      message: 'Category created successfully',
    })
    .input(CategoryModels.createInput)
    .output(CategoryModels.createOutput)
    .mutation(({ ctx, input }) => ctx.categoryService.create(input)),

  update: protectedProcedure
    .meta({
      roles: ['admin', 'moderator'],
      message: 'Category updated successfully',
    })
    .input(CategoryModels.updateInput)
    .output(CategoryModels.updateOutput)
    .mutation(({ ctx, input }) => ctx.categoryService.update(input)),

  delete: protectedProcedure
    .meta({
      roles: ['admin', 'moderator'],
      message: 'Category deleted successfully',
    })
    .input(CategoryModels.deleteInput)
    .output(CategoryModels.deleteOutput)
    .mutation(({ ctx, input }) => ctx.categoryService.delete(input)),
})
