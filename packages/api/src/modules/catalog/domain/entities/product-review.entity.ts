import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class ProductReviewEntity extends AbstractEntity<ProductReviewEntity> {
  declare public rating: number
  declare public comment: string

  declare public productId: string
  declare public userId: string
}
