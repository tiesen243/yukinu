import type { Database } from '@yukinu/db'
import type {
  NewVendor,
  NewVendorMember,
  Vendor,
  VendorMember,
  vendors,
} from '@yukinu/db/schema/vendor'

import type { IBaseRepository } from '@/types'

export interface IVendorRepository extends IBaseRepository<typeof vendors> {
  findWithOwner(
    criteria: Partial<typeof vendors.$inferSelect>[],
    limit: number,
    offset: number,
    tx?: Database,
  ): Promise<IVendorRepository.FindWithOwnerResult[]>

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
  export type VendorStatus = Vendor['status']

  export type VendorMemberType = VendorMember
  export type NewVendorMemberType = NewVendorMember

  export interface FindWithOwnerResult {
    id: string
    name: string
    owner: string
    status: Vendor['status']
    createdAt: Date
    updatedAt: Date
  }
}
