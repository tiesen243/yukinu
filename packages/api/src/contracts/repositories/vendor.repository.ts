import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { Database } from '@yukinu/db'
import type { vendors } from '@yukinu/db/schema'
import type { UserSchema } from '@yukinu/validators/auth'
import type { VendorSchema, VendorStaffSchema } from '@yukinu/validators/vendor'

export interface IVendorRepository extends IBaseRepository<typeof vendors> {
  allWithRelations(
    criterias?: Partial<VendorSchema>[],
    orderBy?: Partial<Record<keyof VendorSchema, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: Database,
  ): Promise<
    (Pick<
      VendorSchema,
      'id' | 'name' | 'status' | 'createdAt' | 'updatedAt'
    > & {
      owner: Pick<UserSchema, 'id' | 'username' | 'email'>
      staffCount: number
    })[]
  >

  allStaffByVendorId(
    vendorId: VendorSchema['id'],
    tx?: Database,
  ): Promise<
    (Pick<UserSchema, 'id' | 'username' | 'email'> & {
      assignedAt: Date
    })[]
  >

  findStaff(
    vendorId: VendorSchema['id'],
    userId: UserSchema['id'],
    tx?: Database,
  ): Promise<VendorStaffSchema | null>

  addStaff(
    vendorId: VendorSchema['id'],
    userId: UserSchema['id'],
    tx?: Database,
  ): Promise<UserSchema['id']>

  removeStaff(
    vendorId: VendorSchema['id'],
    userId: UserSchema['id'],
    tx?: Database,
  ): Promise<UserSchema['id']>
}
