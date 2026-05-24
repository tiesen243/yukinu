import type { Database } from '@yukinu/db/drizzle'

import type { PaymentEntity } from '@/modules/finance/domain/entities/payment.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface PaymentRepository extends AbstractRepository<PaymentEntity> {
  deductCancelledOrderAmount(
    params: {
      paymentId: string
      canceledOrderId: number
      taxRate: number
      shippingCost: number
    },
    tx: Database,
  ): Promise<void>
}
