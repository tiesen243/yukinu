import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class VendorStaffEntity extends AbstractEntity<VendorStaffEntity> {
  declare public assignedAt: Date

  declare public vendorId: string
  declare public userId: string

  public constructor(
    props: AbstractEntity.EntityProps<VendorStaffEntity, 'assignedAt'>,
  ) {
    super({
      assignedAt: new Date(),
      ...props,
    })
  }
}

export namespace VendorStaffEntity {
  export type WithUser = VendorStaffEntity & {
    username: string
    email: string
  }
}
