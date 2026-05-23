import type { Database } from '@yukinu/db/drizzle'

import { eq, sql } from '@yukinu/db/drizzle'
import { orders, payments, vouchers } from '@yukinu/db/schema'

import type { PaymentRepository } from '@/modules/finance/domain/repositories/payment.repository'

import { PaymentEntity } from '@/modules/finance/domain/entities/payment.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzlePaymentRepository
  extends DrizzleRepository<PaymentEntity, typeof payments>
  implements PaymentRepository
{
  public constructor(db: Database) {
    super(db, payments, 'id')
  }

  async deductCancelledOrderAmount(
    params: {
      paymentId: string
      cancelledOrderId: number
      orderSubtotal: number
      taxRate: number
      shippingCost: number
    },
    tx: Database,
  ): Promise<void> {
    const { paymentId, taxRate, shippingCost } = params

    await tx
      .update(payments)
      .set({
        amount: sql`
          COALESCE(
            (
              SELECT 
                GREATEST(0, 
                  (SUM(o.total_amount) * (1 + ${taxRate}) + ${shippingCost}) 
                  - 
                  COALESCE(
                    CASE 
                      WHEN v.discount_amount IS NOT NULL THEN v.discount_amount
                      WHEN v.discount_percentage IS NOT NULL THEN (SUM(o.total_amount) * v.discount_percentage / 100)
                      ELSE 0
                    END, 
                    0
                  )
                )
              FROM ${orders} o
              LEFT JOIN ${vouchers} v ON v.id = ${payments.voucherId}
              WHERE o.payment_id = ${paymentId} 
                AND o.status <> 'cancelled'
            ),
            0
          )::numeric(10,2)`,
      })
      .where(eq(payments.id, paymentId))
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof payments>,
  ): PaymentEntity {
    return new PaymentEntity(row)
  }
}
