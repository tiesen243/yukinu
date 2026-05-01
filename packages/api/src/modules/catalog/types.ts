import type { AllCategoriesUseCase } from '@/modules/catalog/application/use-cases/category/all-categories.use-case'
import type { DeleteCategoryUseCase } from '@/modules/catalog/application/use-cases/category/delete-category.use-case'
import type { OneCategoryUseCase } from '@/modules/catalog/application/use-cases/category/one-category.use-case'
import type { SaveCategoryUseCase } from '@/modules/catalog/application/use-cases/category/save-category.use-case'
import type { AllProductsUseCase } from '@/modules/catalog/application/use-cases/product/all-products.use-case'
import type { CreateProductUseCase } from '@/modules/catalog/application/use-cases/product/create-product.use-case'
import type { DeleteProductUseCase } from '@/modules/catalog/application/use-cases/product/delete-product.use-case'
import type { OneProductUseCase } from '@/modules/catalog/application/use-cases/product/one-product.use-case'
import type { PermanentDeleteProductUseCase } from '@/modules/catalog/application/use-cases/product/permanent-delete.use-case'
import type { RestoreProductUseCase } from '@/modules/catalog/application/use-cases/product/restore-product.use-case'
import type { UpdateProductUseCase } from '@/modules/catalog/application/use-cases/product/update-product.use-case'
import type { DeleteVariantUseCase } from '@/modules/catalog/application/use-cases/variant/delete-variant.use-case'
import type { RecreateVariantUseCase } from '@/modules/catalog/application/use-cases/variant/recreate-variant.use-case'
import type { UpdateVariantUseCase } from '@/modules/catalog/application/use-cases/variant/update-variant.use-case'

export interface UseCases {
  category: {
    all: AllCategoriesUseCase
    delete: DeleteCategoryUseCase
    one: OneCategoryUseCase
    save: SaveCategoryUseCase
  }
  product: {
    all: AllProductsUseCase
    one: OneProductUseCase
    create: CreateProductUseCase
    update: UpdateProductUseCase
    delete: DeleteProductUseCase
    restore: RestoreProductUseCase
    permanentDelete: PermanentDeleteProductUseCase
  }
  variant: {
    delete: DeleteVariantUseCase
    recreate: RecreateVariantUseCase
    update: UpdateVariantUseCase
  }
}

// Category DTOs
export { AllCategoriesDto } from '@/modules/catalog/application/dtos/category/all-categories.dto'
export { DeleteCategoryDto } from '@/modules/catalog/application/dtos/category/delete-category.dto'
export { OneCategoryDto } from '@/modules/catalog/application/dtos/category/one-category.dto'
export { SaveCategoryDto } from '@/modules/catalog/application/dtos/category/save-category.dto'

// Product DTOs
export { AllProductsDto } from '@/modules/catalog/application/dtos/product/all-products.dto'
export { SaveProductDto } from '@/modules/catalog/application/dtos/product/save-product.dto'
export { OneProductDto } from '@/modules/catalog/application/dtos/product/one-product.dto'

// Variant DTOs
export { DeleteVariantDto } from '@/modules/catalog/application/dtos/variant/delete-variant.dto'
export { RecreateVariantDto } from '@/modules/catalog/application/dtos/variant/recreate-variant.dto'
export { UpdateVariantDto } from '@/modules/catalog/application/dtos/variant/update-variant.dto'
