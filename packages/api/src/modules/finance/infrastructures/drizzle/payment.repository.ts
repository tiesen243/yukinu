import type { Database } from '@yukinu/db/drizzle'

import { and, eq, ne, sql } from '@yukinu/db/drizzle'
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

  public async deductCancelledOrderAmount(
    params: {
      paymentId: string
      cancelledOrderId: number
      taxRate: number
      shippingCost: number
    },
    tx: Database,
  ): Promise<void> {
    const { paymentId, taxRate, shippingCost } = params

    const [subtotalResult] = await tx
      .select({
        activeSubtotal: sql<string>`sum(${orders.totalAmount})`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.paymentId, paymentId),
          ne(orders.id, params.cancelledOrderId),
          ne(orders.status, 'cancelled'),
        ),
      )

    const activeSubtotal = Number(subtotalResult?.activeSubtotal || 0)

    if (activeSubtotal === 0) {
      await tx
        .update(payments)
        .set({ amount: '0.00' })
        .where(eq(payments.id, paymentId))
      return
    }

    const [paymentWithVoucher] = await tx
      .select({
        paymentId: payments.id,
        discountAmount: vouchers.discountAmount,
        discountPercentage: vouchers.discountPercentage,
      })
      .from(payments)
      .leftJoin(vouchers, eq(vouchers.id, payments.voucherId))
      .where(eq(payments.id, paymentId))
      .limit(1)

    let discount = 0
    if (paymentWithVoucher?.discountAmount)
      discount = Number.parseFloat(paymentWithVoucher.discountAmount)
    else if (paymentWithVoucher?.discountPercentage)
      discount += (paymentWithVoucher.discountPercentage / 100) * activeSubtotal

    const amountAfterDiscount = Math.max(activeSubtotal - discount, 0)
    const grossAmount =
      amountAfterDiscount + amountAfterDiscount * taxRate + shippingCost

    await tx
      .update(payments)
      .set({ amount: Math.max(grossAmount, 0).toFixed(2) })
      .where(eq(payments.id, paymentId))
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof payments>,
  ): PaymentEntity {
    return new PaymentEntity(row)
  }
}
