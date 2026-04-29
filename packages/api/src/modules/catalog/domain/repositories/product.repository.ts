import type { ProductEntity } from '@/modules/catalog/domain/entities/product.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface ProductRepository extends AbstractRepository<ProductEntity> {}
