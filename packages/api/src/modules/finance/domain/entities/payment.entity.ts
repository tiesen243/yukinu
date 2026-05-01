import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class PaymentEntity extends AbstractEntity<PaymentEntity> {
  declare public method: PaymentEntity.Method
  declare public methodReference: string | null
  declare public amount: string
  declare public status: PaymentEntity.Status

  declare public voucherId: string | null

  public constructor(
    props: AbstractEntity.EntityProps<PaymentEntity, 'status'>,
  ) {
    super({
      methodReference: null,
      voucherId: null,
      status: 'pending',
      ...props,
    })
  }
}

export namespace PaymentEntity {
  export const methods = ['bank_transfer', 'cash_on_delivery'] as const
  export type Method = (typeof methods)[number]

  export const statuses = ['pending', 'success', 'failed'] as const
  export type Status = (typeof statuses)[number]
}
