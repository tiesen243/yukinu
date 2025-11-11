import type { User } from '@yukinu/db/schema/user'
import type { NewVendor, Vendor, vendors } from '@yukinu/db/schema/vendor'

import type { IBaseRepository } from '@/types'

export interface IVendorRepository extends IBaseRepository<typeof vendors> {
  findWithOwner(
    id: IVendorRepository.IVendor['id'],
  ): Promise<IVendorRepository.VendorWithOwner | null>
}

export namespace IVendorRepository {
  export type IVendor = Vendor
  export type INewVendor = NewVendor

  export type VendorWithOwner = Vendor & {
    owner: User
  }
}
