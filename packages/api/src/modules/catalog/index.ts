import type { TRPCRouterRecord } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { UseCases } from '@/modules/catalog/types'

import { AllCategoriesUseCase } from '@/modules/catalog/application/use-cases/category/all-categories.use-case'
import { DeleteCategoryUseCase } from '@/modules/catalog/application/use-cases/category/delete-category.use-case'
import { OneCategoryUseCase } from '@/modules/catalog/application/use-cases/category/one-category.use-case'
import { SaveCategoryUseCase } from '@/modules/catalog/application/use-cases/category/save-category.use-case'
import { DrizzleCategoryRepository } from '@/modules/catalog/infrastructures/drizzle/category.repository'
import { categoryRouter } from '@/modules/catalog/interfaces/category.router'

export const createCatalogModule = (db: Database) => {
  const categoryRepo = new DrizzleCategoryRepository(db)

  const useCases = {
    category: {
      all: new AllCategoriesUseCase(db, categoryRepo),
      delete: new DeleteCategoryUseCase(db, categoryRepo),
      one: new OneCategoryUseCase(db, categoryRepo),
      save: new SaveCategoryUseCase(db, categoryRepo),
    },
  } satisfies UseCases

  return {
    useCases,

    router: {
      category: categoryRouter(useCases),
    } satisfies TRPCRouterRecord,
  }
}
