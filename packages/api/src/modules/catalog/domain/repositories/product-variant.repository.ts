import type { ProductVariantEntity } from '@/modules/catalog/domain/entities/product-variant.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface ProductVariantRepository extends AbstractRepository<ProductVariantEntity> {}
