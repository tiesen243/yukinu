import type { Database } from '@yukinu/db'
import type { NewVendor, Vendor, vendors } from '@yukinu/db/schema/vendor'

import type { IBaseRepository } from '@/types'

export interface IVendorRepository extends IBaseRepository<typeof vendors> {
  getMember(
    vendorId: string,
    userId: string,
    tx?: Database,
  ): Promise<{ id: string } | null>

  addMember(
    vendorId: string,
    userId: string,
    tx?: Database,
  ): Promise<{ id: string } | null>
}

export declare namespace IVendorRepository {
  export type VendorType = Vendor
  export type NewVendorType = NewVendor
}
