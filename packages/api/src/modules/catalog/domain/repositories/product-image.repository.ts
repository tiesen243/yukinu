import type { ProductImageEntity } from '@/modules/catalog/domain/entities/product-image.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface ProductImageRepository extends AbstractRepository<ProductImageEntity> {}
