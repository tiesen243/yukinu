import type { ProductAttributeEntity } from '@/modules/catalog/domain/entities/product-attribute.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface ProductAttributeRepository extends AbstractRepository<ProductAttributeEntity> {}
