import type { Database } from '@yukinu/db/drizzle'

import { variantOptions } from '@yukinu/db/schema'

import type { VariantOptionRepository } from '@/modules/catalog/domain/repositories/variant-option.repository'

import { VariantOptionEntity } from '@/modules/catalog/domain/entities/variant-option.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleVariantOptionRepository
  extends DrizzleRepository<VariantOptionEntity, typeof variantOptions, number>
  implements VariantOptionRepository
{
  public constructor(db: Database) {
    super(db, variantOptions, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof variantOptions>,
  ): VariantOptionEntity {
    return new VariantOptionEntity(row)
  }
}
