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
        and(eq(orders.paymentId, paymentId), ne(orders.status, 'cancelled')),
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

    const baseAmountWithTaxAndShipping =
      activeSubtotal * (1 + taxRate) + shippingCost
    let discount = 0

    if (paymentWithVoucher) {
      if (paymentWithVoucher.discountAmount !== null)
        discount = Number(paymentWithVoucher.discountAmount)
      else if (paymentWithVoucher.discountPercentage !== null)
        discount =
          (activeSubtotal * Number(paymentWithVoucher.discountPercentage)) / 100
    }

    const finalAmount = Math.max(0, baseAmountWithTaxAndShipping - discount)

    await tx
      .update(payments)
      .set({ amount: finalAmount.toFixed(2) })
      .where(eq(payments.id, paymentId))
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof payments>,
  ): PaymentEntity {
    return new PaymentEntity(row)
  }
}
