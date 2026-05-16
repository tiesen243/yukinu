import type { Database } from '@yukinu/db/drizzle'

import { attributes } from '@yukinu/db/schema'

import type { AttributeRepository } from '@/modules/catalog/domain/repositories/attribute.repository'

import { AttributeEntity } from '@/modules/catalog/domain/entities/attribute.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleAttributeRepository
  extends DrizzleRepository<AttributeEntity, typeof attributes>
  implements AttributeRepository
{
  public constructor(db: Database) {
    super(db, attributes, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof attributes>,
  ): AttributeEntity {
    return new AttributeEntity(row)
  }
}
