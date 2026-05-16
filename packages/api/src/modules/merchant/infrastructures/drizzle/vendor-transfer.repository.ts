import type { Database } from '@yukinu/db/drizzle'

import { vendorTransfers } from '@yukinu/db/schema'

import type { VendorTransferRepository } from '@/modules/merchant/domain/repositories/vendor-transfer.repository'

import { VendorTransferEntity } from '@/modules/merchant/domain/entities/vendor-transfer.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleVendorTransferRepository
  extends DrizzleRepository<VendorTransferEntity, typeof vendorTransfers>
  implements VendorTransferRepository
{
  public constructor(db: Database) {
    super(db, vendorTransfers, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof vendorTransfers>,
  ): VendorTransferEntity {
    return new VendorTransferEntity(row)
  }
}
