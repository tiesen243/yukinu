import type { PaymentEntity } from '@/modules/finance/domain/entities/payment.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface PaymentRepository<
  TTransaction = unknown,
> extends AbstractRepository<PaymentEntity> {
  findWithOrders(
    criterias?: AbstractRepository.Criteria<PaymentEntity>[],
    orderBy?: Partial<Record<keyof PaymentEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: TTransaction,
  ): Promise<PaymentRepository.WithOrders[]>

  deductCancelledOrderAmount(
    params: {
      paymentId: string
      cancelledOrderId: number
      taxRate: number
      shippingCost: number
    },
    tx: TTransaction,
  ): Promise<void>
}

export namespace PaymentRepository {
  export interface WithOrders extends PaymentEntity {
    orders: {
      id: number
      vendorId: string
    }[]
  }
}
