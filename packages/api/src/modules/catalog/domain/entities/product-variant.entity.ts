import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class ProductVariantEntity extends AbstractEntity<ProductVariantEntity> {
  declare public sku: string
  declare public price: number
  declare public stock: number

  declare public productId: string
}
