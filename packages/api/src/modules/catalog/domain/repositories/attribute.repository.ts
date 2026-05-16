import type { AttributeEntity } from '@/modules/catalog/domain/entities/attribute.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface AttributeRepository extends AbstractRepository<AttributeEntity> {}
