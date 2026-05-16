import type { ProductReviewEntity } from '@/modules/catalog/domain/entities/product-review.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface ProductReviewRepository extends AbstractRepository<ProductReviewEntity> {}
