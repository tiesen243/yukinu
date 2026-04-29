import type { Database } from '@yukinu/db/drizzle'

import { vendors } from '@yukinu/db/schema'

import type { VendorRepository } from '@/modules/merchant/domain/repositories/vendor.repository'

import { VendorEntity } from '@/modules/merchant/domain/entities/vendor.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleVendorRepository
  extends DrizzleRepository<VendorEntity, typeof vendors>
  implements VendorRepository
{
  public constructor(db: Database) {
    super(db, vendors, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof vendors>,
  ): VendorEntity {
    return new VendorEntity(row)
  }
}
