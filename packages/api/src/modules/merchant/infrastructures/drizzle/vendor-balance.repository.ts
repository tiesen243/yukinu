import type { Database } from '@yukinu/db/drizzle'

import { vendorBalances } from '@yukinu/db/schema'

import type { VendorBalanceRepository } from '@/modules/merchant/domain/repositories/vendor-balance.repository'

import { VendorBalanceEntity } from '@/modules/merchant/domain/entities/vendor-balance.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleVendorBalanceRepository
  extends DrizzleRepository<VendorBalanceEntity, typeof vendorBalances>
  implements VendorBalanceRepository
{
  public constructor(db: Database) {
    super(db, vendorBalances, 'vendorId')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof vendorBalances>,
  ): VendorBalanceEntity {
    return new VendorBalanceEntity(row)
  }
}
