import type { TRPCRouterRecord } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { UseCases } from '@/modules/catalog/types'
import type { VendorMiddleware } from '@/modules/merchant/interfaces/vendor.middleware'

import { AllCategoriesUseCase } from '@/modules/catalog/application/use-cases/category/all-categories.use-case'
import { DeleteCategoryUseCase } from '@/modules/catalog/application/use-cases/category/delete-category.use-case'
import { OneCategoryUseCase } from '@/modules/catalog/application/use-cases/category/one-category.use-case'
import { SaveCategoryUseCase } from '@/modules/catalog/application/use-cases/category/save-category.use-case'
import { AllProductsUseCase } from '@/modules/catalog/application/use-cases/product/all-products.use-case'
import { CreateProductUseCase } from '@/modules/catalog/application/use-cases/product/create-product.use-case'
import { DeleteProductUseCase } from '@/modules/catalog/application/use-cases/product/delete-product.use-case'
import { OneProductUseCase } from '@/modules/catalog/application/use-cases/product/one-product.use-case'
import { PermanentDeleteProductUseCase } from '@/modules/catalog/application/use-cases/product/permanent-delete.use-case'
import { RestoreProductUseCase } from '@/modules/catalog/application/use-cases/product/restore-product.use-case'
import { UpdateProductUseCase } from '@/modules/catalog/application/use-cases/product/update-product.use-case'
import { DeleteVariantUseCase } from '@/modules/catalog/application/use-cases/variant/delete-variant.use-case'
import { RecreateVariantUseCase } from '@/modules/catalog/application/use-cases/variant/recreate-variant.use-case'
import { UpdateVariantUseCase } from '@/modules/catalog/application/use-cases/variant/update-variant.use-case'
import { DrizzleCategoryRepository } from '@/modules/catalog/infrastructures/drizzle/category.repository'
import { DrizzleProductAttributeRepository } from '@/modules/catalog/infrastructures/drizzle/product-attribute.repository'
import { DrizzleProductImageRepository } from '@/modules/catalog/infrastructures/drizzle/product-image.repository'
import { DrizzleProductVariantRepository } from '@/modules/catalog/infrastructures/drizzle/product-variant.repository'
import { DrizzleProductRepository } from '@/modules/catalog/infrastructures/drizzle/product.repository'
import { DrizzleVariantRepository } from '@/modules/catalog/infrastructures/drizzle/variant.repository'
import { categoryRouter } from '@/modules/catalog/interfaces/category.router'
import { productRouter } from '@/modules/catalog/interfaces/product.router'
import { variantRouter } from '@/modules/catalog/interfaces/variant.router'

export const createCatalogModule = (
  db: Database,
  deps: {
    vendorMiddleware: VendorMiddleware
  },
) => {
  const categoryRepo = new DrizzleCategoryRepository(db)
  const productAttributeRepo = new DrizzleProductAttributeRepository(db)
  const productImageRepo = new DrizzleProductImageRepository(db)
  const productVariantRepo = new DrizzleProductVariantRepository(db)
  const productRepo = new DrizzleProductRepository(db)
  const variantRepo = new DrizzleVariantRepository(db)

  const useCases = {
    category: {
      all: new AllCategoriesUseCase(db, categoryRepo),
      delete: new DeleteCategoryUseCase(db, categoryRepo),
      one: new OneCategoryUseCase(db, categoryRepo),
      save: new SaveCategoryUseCase(db, categoryRepo),
    },
    product: {
      all: new AllProductsUseCase(db, productRepo),
      one: new OneProductUseCase(db, productRepo),
      create: new CreateProductUseCase(
        db,
        categoryRepo,
        productAttributeRepo,
        productImageRepo,
        productRepo,
        variantRepo,
      ),
      update: new UpdateProductUseCase(
        db,
        categoryRepo,
        productAttributeRepo,
        productImageRepo,
        productRepo,
      ),
      delete: new DeleteProductUseCase(db, productRepo),
      restore: new RestoreProductUseCase(db, productRepo),
      permanentDelete: new PermanentDeleteProductUseCase(
        db,
        productImageRepo,
        productRepo,
      ),
    },
    variant: {
      delete: new DeleteVariantUseCase(db, productVariantRepo),
      recreate: new RecreateVariantUseCase(
        db,
        productVariantRepo,
        productRepo,
        variantRepo,
      ),
      update: new UpdateVariantUseCase(db, productVariantRepo),
    },
  } satisfies UseCases

  return {
    useCases,

    router: {
      category: categoryRouter(useCases),
      product: productRouter(useCases, {
        vendorMiddleware: deps.vendorMiddleware,
      }),
      variant: variantRouter(useCases, {
        vendorMiddleware: deps.vendorMiddleware,
      }),
    } satisfies TRPCRouterRecord,
  }
}
