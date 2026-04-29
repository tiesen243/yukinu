import type { VariantEntity } from '@/modules/catalog/domain/entities/variant.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface VariantRepository extends AbstractRepository<VariantEntity> {}
