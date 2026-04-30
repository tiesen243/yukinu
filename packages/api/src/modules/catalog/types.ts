import type { AllCategoriesUseCase } from '@/modules/catalog/application/use-cases/category/all-categories.use-case'
import type { DeleteCategoryUseCase } from '@/modules/catalog/application/use-cases/category/delete-category.use-case'
import type { OneCategoryUseCase } from '@/modules/catalog/application/use-cases/category/one-category.use-case'
import type { SaveCategoryUseCase } from '@/modules/catalog/application/use-cases/category/save-category.use-case'

export interface UseCases {
  category: {
    all: AllCategoriesUseCase
    delete: DeleteCategoryUseCase
    one: OneCategoryUseCase
    save: SaveCategoryUseCase
  }
}
