import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { OneOrderDto } from '@/modules/checkout/application/dtos/order/one-order.dto'
import type { OrderRepository } from '@/modules/checkout/domain/repositories/order.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class OneOrderUseCase extends AbstractUseCase<
  OneOrderDto.Input,
  OneOrderDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _orderRepo: OrderRepository,
  ) {
    super()
  }

  public async execute(input: OneOrderDto.Input): Promise<OneOrderDto.Output> {
    const { id, userId, vendorId } = input

    const order = await this._orderRepo.oneWithDetails({
      id,
      ...(userId ? { userId } : {}),
      ...(vendorId ? { vendorId } : {}),
    })

    if (!order)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Order not found.',
      })

    return order
  }
}
