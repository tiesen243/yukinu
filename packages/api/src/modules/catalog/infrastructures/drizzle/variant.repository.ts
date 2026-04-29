import type { Database } from '@yukinu/db/drizzle'

import { variants } from '@yukinu/db/schema'

import type { VariantRepository } from '@/modules/catalog/domain/repositories/variant.repository'

import { VariantEntity } from '@/modules/catalog/domain/entities/variant.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleVariantRepository
  extends DrizzleRepository<VariantEntity, typeof variants>
  implements VariantRepository
{
  public constructor(db: Database) {
    super(db, variants, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof variants>,
  ): VariantEntity {
    return new VariantEntity(row)
  }
}
