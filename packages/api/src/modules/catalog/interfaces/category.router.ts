import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/catalog/types'

import { AllCategoriesDto } from '@/modules/catalog/application/dtos/category/all-categories.dto'
import { DeleteCategoryDto } from '@/modules/catalog/application/dtos/category/delete-category.dto'
import { OneCategoryDto } from '@/modules/catalog/application/dtos/category/one-category.dto'
import { SaveCategoryDto } from '@/modules/catalog/application/dtos/category/save-category.dto'
import { protectedProcedure, publicProcedure } from '@/trpc'

export const categoryRouter = ({ category }: UseCases) =>
  ({
    all: publicProcedure
      .output(AllCategoriesDto.output)
      .input(AllCategoriesDto.input)
      .query(({ input }) => category.all.execute(input)),

    one: publicProcedure
      .output(OneCategoryDto.output)
      .input(OneCategoryDto.input)
      .query(({ input }) => category.one.execute(input)),

    save: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .output(SaveCategoryDto.output)
      .input(SaveCategoryDto.input)
      .mutation(({ input }) => category.save.execute(input)),

    delete: protectedProcedure
      .output(DeleteCategoryDto.output)
      .input(DeleteCategoryDto.input)
      .mutation(({ input }) => category.delete.execute(input)),
  }) satisfies TRPCRouterRecord
