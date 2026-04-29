import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class PaymentEntity extends AbstractEntity<PaymentEntity> {
  declare public method: PaymentEntity.Method
  declare public methodReference: string | null
  declare public amount: number
  declare public status: PaymentEntity.Status

  declare public voucherId: string | null

  public constructor(props: AbstractEntity.EntityProps<PaymentEntity>) {
    super({
      methodReference: null,
      voucherId: null,
      ...props,
    })
  }
}

export namespace PaymentEntity {
  export type Method = 'bank_transfer' | 'cash_on_delivery'
  export type Status = 'pending' | 'success' | 'failed'
}
