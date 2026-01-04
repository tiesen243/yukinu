import * as Validators from '@yukinu/validators/general'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/trpc'

export const categoryRouter = createTRPCRouter({
  all: publicProcedure
    .meta({ message: 'Categories fetched successfully' })
    .input(Validators.allCategoriesInput)
    .output(Validators.allCategoriesOutput)
    .query(({ ctx, input }) => ctx.services.category.all(input)),

  one: publicProcedure
    .meta({ message: 'Category fetched successfully' })
    .input(Validators.oneCategoryInput)
    .output(Validators.oneCategoryOutput)
    .query(({ ctx, input }) => ctx.services.category.one(input)),

  create: protectedProcedure
    .meta({
      message: 'Category created successfully',
      role: ['admin', 'moderator'],
    })
    .input(Validators.createCategoryInput)
    .output(Validators.createCategoryOutput)
    .mutation(({ ctx, input }) => ctx.services.category.create(input)),

  update: protectedProcedure
    .meta({
      message: 'Category updated successfully',
      role: ['admin', 'moderator'],
    })
    .input(Validators.updateCategoryInput)
    .output(Validators.updateCategoryOutput)
    .mutation(({ ctx, input }) => ctx.services.category.update(input)),

  delete: protectedProcedure
    .meta({
      message: 'Category deleted successfully',
      role: ['admin', 'moderator'],
    })
    .input(Validators.deleteCategoryInput)
    .output(Validators.deleteCategoryOutput)
    .mutation(({ ctx, input }) => ctx.services.category.delete(input)),
})
