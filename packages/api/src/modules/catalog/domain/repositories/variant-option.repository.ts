import type { VariantOptionEntity } from '@/modules/catalog/domain/entities/variant-option.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface VariantOptionRepository extends AbstractRepository<
  VariantOptionEntity,
  number
> {}
