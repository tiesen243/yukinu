import type { Database } from '@yukinu/db/drizzle'

import { addresses } from '@yukinu/db/schema'

import type { AddressRepository } from '@/modules/identity/domain/repositories/address.repository'

import { AddressEntity } from '@/modules/identity/domain/entities/address.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleAddressRepository
  extends DrizzleRepository<AddressEntity, typeof addresses>
  implements AddressRepository
{
  public constructor(db: Database) {
    super(db, addresses, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof addresses>,
  ): AddressEntity {
    return new AddressEntity(row)
  }
}
