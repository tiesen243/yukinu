import type { Database } from '@yukinu/db'
import type { User } from '@yukinu/db/schema/user'
import type { NewVendor, Vendor, vendors } from '@yukinu/db/schema/vendor'

import type { IBaseRepository } from '@/types'

export interface IVendorRepository extends IBaseRepository<typeof vendors> {
  findWithOwner(
    criteria: Partial<IVendorRepository.IVendor>[],
    limit?: number,
    offset?: number,
    tx?: Database,
  ): Promise<IVendorRepository.VendorWithOwner[]>
}

export namespace IVendorRepository {
  export type IVendor = Vendor
  export type INewVendor = NewVendor

  export interface VendorWithOwner {
    id: IVendor['id']
    name: IVendor['name']
    status: IVendor['status']
    owner: User['username']
    updatedAt: IVendor['updatedAt']
  }
}
