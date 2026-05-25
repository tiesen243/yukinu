import type { Database } from '@yukinu/db/drizzle'

import { and, eq, ne, sql } from '@yukinu/db/drizzle'
import { orders, payments, vouchers } from '@yukinu/db/schema'

import type { PaymentRepository } from '@/modules/finance/domain/repositories/payment.repository'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

import { PaymentEntity } from '@/modules/finance/domain/entities/payment.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzlePaymentRepository
  extends DrizzleRepository<PaymentEntity, typeof payments>
  implements PaymentRepository
{
  public constructor(db: Database) {
    super(db, payments, 'id')
  }

  public async findWithOrders(
    criterias: AbstractRepository.Criteria<PaymentEntity>[] = [],
    orderBy: Partial<Record<keyof PaymentEntity, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx: Database = this._db,
  ): Promise<PaymentRepository.WithOrders[]> {
    const whereClauses = this._buildCriteria(criterias)
    const orderByClause = this._buildOrderBy(orderBy)

    const query = tx
      .select({
        id: payments.id,
        method: payments.method,
        methodReference: payments.methodReference,
        amount: payments.amount,
        paidAmount: payments.paidAmount,
        voucherId: payments.voucherId,
        status: payments.status,
        createdAt: payments.createdAt,
        updatedAt: payments.updatedAt,
        orders: sql<
          PaymentRepository.WithOrders['orders']
        >`array_agg(json_build_object('id', ${orders.id}, 'vendorId', ${orders.vendorId}))`.as(
          'orders',
        ),
      })
      .from(this._table)
      .leftJoin(orders, eq(orders.paymentId, payments.id))
      .groupBy(payments.id)
      .$dynamic()

    if (whereClauses) query.where(whereClauses)
    if (orderByClause) query.orderBy(orderByClause)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    const rows = await query

    return rows.map((row) =>
      Object.assign(this._mapToEntity(row), { orders: row.orders }),
    )
  }

  public async deductCancelledOrderAmount(
    params: {
      paymentId: string
      cancelledOrderId: number
      taxRate: number
      shippingCost: number
    },
    tx: Database = this._db,
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
