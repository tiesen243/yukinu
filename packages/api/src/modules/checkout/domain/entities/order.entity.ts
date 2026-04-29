import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class OrderEntity extends AbstractEntity<OrderEntity, number> {
  declare public totalAmount: string
  declare public status: OrderEntity.Status

  declare public userId: string | null
  declare public vendorId: string | null
  declare public paymentId: string
  declare public addressId: string | null

  public constructor(props: AbstractEntity.EntityProps<OrderEntity>) {
    super({
      userId: null,
      vendorId: null,
      addressId: null,
      ...props,
    })
  }
}

export namespace OrderEntity {
  export type Status =
    | 'pending'
    | 'confirmed'
    | 'shipped'
    | 'completed'
    | 'cancelled'
}
