import type { Database } from '@yukinu/db'
import type {
  productImages,
  products,
  productVariantGroups,
  productVariants,
} from '@yukinu/db/schema/product'
import type { productsView } from '@yukinu/db/schema/view'

import type {
  IBaseRepository,
  ICategoryRepository,
  IVendorRepository,
} from '@/types'

export interface IProductRepository extends IBaseRepository<typeof products> {
  findAllView(
    search?: string,
    limit?: number,
    offset?: number,
    tx?: Database,
  ): Promise<IProductRepository.ProductsView[]>

  countAllView(search?: string, tx?: Database): Promise<number>

  findWithRelations(
    productId: string,
    tx?: Database,
  ): Promise<
    | (Pick<
        IProductRepository.Product,
        'id' | 'name' | 'description' | 'price' | 'stock' | 'status'
      > & {
        vendor: Pick<
          IVendorRepository.Vendor,
          'id' | 'name' | 'imageUrl' | 'website'
        >
        category: Pick<ICategoryRepository.Category, 'id' | 'name'>
        images: Pick<IProductRepository.ProductImage, 'url' | 'alt'>[]
        variantGroups: (Pick<
          IProductRepository.ProductVariantGroup,
          'id' | 'name'
        > & {
          variants: Pick<
            IProductRepository.ProductVariant,
            'id' | 'name' | 'extraPrice' | 'stock'
          >[]
        })[]
      })
    | null
  >

  createVariants(
    variantGroups: (IProductRepository.NewProductVariantGroup & {
      variants: Omit<IProductRepository.NewProductVariant, 'variantGroupId'>[]
    })[],
    tx?: Database,
  ): Promise<void>

  deleteVariantsByProductId(productId: string, tx?: Database): Promise<void>

  createImages(
    images: IProductRepository.NewProductImage[],
    tx?: Database,
  ): Promise<void>

  deleteImagesByProductId(productId: string, tx?: Database): Promise<void>
}

export declare namespace IProductRepository {
  export type Product = typeof products.$inferSelect
  export type NewProduct = typeof products.$inferInsert

  export type ProductsView = typeof productsView.$inferSelect

  export type ProductVariantGroup = typeof productVariantGroups.$inferSelect
  export type NewProductVariantGroup = typeof productVariantGroups.$inferInsert

  export type ProductVariant = typeof productVariants.$inferSelect
  export type NewProductVariant = typeof productVariants.$inferInsert

  export type ProductImage = typeof productImages.$inferSelect
  export type NewProductImage = typeof productImages.$inferInsert
}
