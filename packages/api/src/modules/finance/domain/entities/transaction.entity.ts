import { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export class TransactionEntity extends AbstractEntity<TransactionEntity> {
  declare public gateway: string
  declare public body: string | null
  declare public amountIn: number | null
  declare public amountOut: number | null
  declare public referenceNumber: string | null
  declare public transactionContent: string | null
  declare public transactionDate: Date

  declare public paymentId: string

  public constructor(props: AbstractEntity.EntityProps<TransactionEntity>) {
    super({
      body: null,
      amountIn: null,
      amountOut: null,
      referenceNumber: null,
      transactionContent: null,
      ...props,
    })
  }
}
