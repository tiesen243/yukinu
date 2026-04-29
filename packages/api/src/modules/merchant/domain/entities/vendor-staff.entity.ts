import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class VendorStaffEntity extends AbstractEntity<VendorStaffEntity> {
  declare public assignedAt: Date

  declare public vendorId: string
  declare public userId: string
}
