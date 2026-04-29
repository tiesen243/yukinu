import type { Database } from '@yukinu/db/drizzle'

import { productReviews } from '@yukinu/db/schema'

import type { ProductReviewRepository } from '@/modules/catalog/domain/repositories/product-review.repository'

import { ProductReviewEntity } from '@/modules/catalog/domain/entities/product-review.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleProductReviewRepository
  extends DrizzleRepository<ProductReviewEntity, typeof productReviews>
  implements ProductReviewRepository
{
  public constructor(db: Database) {
    super(db, productReviews, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof productReviews>,
  ): ProductReviewEntity {
    return new ProductReviewEntity(row)
  }
}
