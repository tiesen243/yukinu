import type { Database } from '@yukinu/db/drizzle'

import { vendorStaffs } from '@yukinu/db/schema'

import type { VendorStaffRepository } from '@/modules/merchant/domain/repositories/vendor-staff.repository'

import { VendorStaffEntity } from '@/modules/merchant/domain/entities/vendor-staff.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleVendorStaffRepository
  extends DrizzleRepository<VendorStaffEntity, typeof vendorStaffs>
  implements VendorStaffRepository
{
  public constructor(db: Database) {
    super(db, vendorStaffs, ['vendorId', 'userId'])
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof vendorStaffs>,
  ): VendorStaffEntity {
    return new VendorStaffEntity(row)
  }
}
