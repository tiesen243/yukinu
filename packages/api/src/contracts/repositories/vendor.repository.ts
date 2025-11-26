import type { Database } from '@yukinu/db'
import type { vendors } from '@yukinu/db/schema/vendor'

import type { IBaseRepository, IUserRepository } from '@/types'

export interface IVendorRepository extends IBaseRepository<typeof vendors> {
  findWithOwner(
    criteria: Partial<IVendorRepository.Vendor>[],
    limit?: number,
    offset?: number,
    tx?: Database,
  ): Promise<IVendorRepository.VendorWithOwner[]>

  findByStaffId(
    staffId: string,
    tx?: Database,
  ): Promise<Pick<IVendorRepository.Vendor, 'id'> | null>
}

export namespace IVendorRepository {
  export type Vendor = typeof vendors.$inferSelect
  export type NewVendor = typeof vendors.$inferInsert

  export interface VendorWithOwner {
    id: Vendor['id']
    name: Vendor['name']
    status: Vendor['status']
    owner: IUserRepository.User['username']
    updatedAt: Vendor['updatedAt']
  }
}
