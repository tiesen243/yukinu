import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'
import { SHIPPING_COST, TAX_RATE } from '@yukinu/lib/constants'

import type { UpdateOrderStatusDto } from '@/modules/checkout/application/dtos/order/update-order-status'
import type { OrderRepository } from '@/modules/checkout/domain/repositories/order.repository'
import type { OrderEntity } from '@/modules/checkout/types'
import type { PaymentRepository } from '@/modules/finance/domain/repositories/payment.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class UpdateOrderStatusUseCase extends AbstractUseCase<
  UpdateOrderStatusDto.Input,
  UpdateOrderStatusDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _orderRepo: OrderRepository,
    private readonly _paymentRepo: PaymentRepository,
  ) {
    super()
  }

  public async execute(
    input: UpdateOrderStatusDto.Input,
  ): Promise<UpdateOrderStatusDto.Output> {
    const { id, status } = input

    const [order] = await this._orderRepo.find([{ id }], {}, { limit: 1 })
    if (!order)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found.' })

    this._validateStatusTransition(order.status, status)

    return this._db.transaction(async (tx) => {
      const updatedOrder = order.clone({ status })
      await this._orderRepo.save(updatedOrder, tx)

      if (status === 'cancelled')
        await this._paymentRepo.deductCancelledOrderAmount(
          {
            paymentId: order.paymentId,
            canceledOrderId: order.id,
            taxRate: TAX_RATE,
            shippingCost: SHIPPING_COST,
          },
          tx,
        )
    })
  }

  private _validateStatusTransition(
    current: OrderEntity.Status,
    target: OrderEntity.Status,
  ) {
    const ALLOWED_TRANSITIONS: Record<
      OrderEntity.Status,
      OrderEntity.Status[]
    > = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['shipped', 'cancelled'],
      shipped: ['completed'],
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
}
