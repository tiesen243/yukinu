import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class ProductImageEntity extends AbstractEntity<ProductImageEntity> {
  declare public url: string

  declare public productId: string
}
