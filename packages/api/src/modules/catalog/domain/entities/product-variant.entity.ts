import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class ProductVariantEntity extends AbstractEntity<ProductVariantEntity> {
  declare public sku: string
  declare public price: string
  declare public stock: number

  declare public productId: string
}
