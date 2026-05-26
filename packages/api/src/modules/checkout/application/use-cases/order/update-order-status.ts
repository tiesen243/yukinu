import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'
import { SHIPPING_COST, TAX_RATE } from '@yukinu/lib/constants'

import type { UpdateOrderStatusDto } from '@/modules/checkout/application/dtos/order/update-order-status'
import type { OrderEntity } from '@/modules/checkout/domain/entities/order.entity'
import type { OrderRepository } from '@/modules/checkout/domain/repositories/order.repository'
import type { PaymentRepository } from '@/modules/finance/domain/repositories/payment.repository'
import type { PaymentEntity } from '@/modules/finance/types'
import type { VendorBalanceRepository } from '@/modules/merchant/domain/repositories/vendor-balance.repository'
import type { VendorTransferRepository } from '@/modules/merchant/domain/repositories/vendor-transfer.repository'

import { VendorBalanceEntity } from '@/modules/merchant/domain/entities/vendor-balance.entity'
import { VendorTransferEntity } from '@/modules/merchant/domain/entities/vendor-transfer.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class UpdateOrderStatusUseCase extends AbstractUseCase<
  UpdateOrderStatusDto.Input,
  UpdateOrderStatusDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _orderRepo: OrderRepository,
    private readonly _paymentRepo: PaymentRepository,
    private readonly _vendorBalanceRepo: VendorBalanceRepository,
    private readonly _vendorTransferRepo: VendorTransferRepository,
  ) {
    super()
  }

  public async execute(
    input: UpdateOrderStatusDto.Input,
  ): Promise<UpdateOrderStatusDto.Output> {
    const { id, status } = input

    const [order] = await this._orderRepo.findWithPayment(
      [{ id }],
      {},
      { limit: 1 },
    )
    if (!order)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found.' })

    this._validateStatusTransition(order.status, order.payment?.status, status)

    return this._db.transaction(async (tx) => {
      const updatedOrder = order.clone({ status })
      await this._orderRepo.save(updatedOrder, tx)

      if (status === 'cancelled')
        await this._paymentRepo.deductCancelledOrderAmount(
          {
            paymentId: order.paymentId,
            cancelledOrderId: order.id,
            taxRate: TAX_RATE,
            shippingCost: SHIPPING_COST,
          },
          tx,
        )

      if (status === 'confirmed' && order.payment?.status === 'success')
        await this._updateVendorBalance(order, tx)
    })
  }

  private _validateStatusTransition(
    current: OrderEntity.Status,
    paymentStatus: PaymentEntity.Status | undefined,
    target: OrderEntity.Status,
  ) {
    if (
      (!paymentStatus || paymentStatus !== 'success') &&
      target === 'received'
    )
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Orders cannot be marked as received or completed until payment is successfully processed.',
      })

    const ALLOWED_TRANSITIONS: Record<
      OrderEntity.Status,
      OrderEntity.Status[]
    > = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: ['received'],
      received: ['completed'],
      completed: [],
      cancelled: [],
    }

    if (current === target) return

    if (!ALLOWED_TRANSITIONS[current].includes(target))
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Invalid status transition from '${current}' to '${target}'.`,
      })
  }

  private async _updateVendorBalance(
    { id: orderId, vendorId, paymentId, totalAmount }: OrderEntity,
    tx: Database,
  ): Promise<void> {
    if (!vendorId || !paymentId) return

    const transfer = new VendorTransferEntity({
      vendorId,
      reference: `Order #${orderId} - Payment ${paymentId}`,
      amountIn: totalAmount,
    })
    await this._vendorTransferRepo.save(transfer, tx)

    let [balance] = await this._vendorBalanceRepo.find(
      [{ vendorId }],
      {},
      { limit: 1 },
      tx,
    )
    if (!balance)
      balance = new VendorBalanceEntity({ vendorId, balance: '0.00' })

    const newBalance = balance.clone({
      balance: (
        Number.parseFloat(balance.balance) + Number.parseFloat(totalAmount)
      ).toFixed(2),
    })
    await this._vendorBalanceRepo.save(newBalance, tx)
  }
}
