import type { Database } from '@yukinu/db/drizzle'

import type { AllOrdersDto } from '@/modules/checkout/application/dtos/order/all-orders.dto'
import type { OrderRepository } from '@/modules/checkout/domain/repositories/order.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class AllOrdersUseCase extends AbstractUseCase<
  AllOrdersDto.Input,
  AllOrdersDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _orderRepo: OrderRepository,
  ) {
    super()
  }

  public async execute(
    input: AllOrdersDto.Input,
  ): Promise<AllOrdersDto.Output> {
    const { page, limit, userId, vendorId, paymentId } = input
    const offset = (page - 1) * limit

    const criteria = Object.fromEntries(
      Object.entries({ userId, vendorId, paymentId }).filter(
        ([, value]) => value !== undefined && value !== null,
      ),
    )
    const whereClauses = Object.keys(criteria).length > 0 ? [criteria] : []

    const [orders, total] = await Promise.all([
      this._orderRepo.findWithItems(
        whereClauses,
        { updatedAt: 'desc' },
        { limit, offset },
      ),
      this._orderRepo.count(whereClauses, this._db),
    ])
    const totalPages = Math.ceil(total / limit)

    return { orders, pagination: { total, page, limit, totalPages } }
  }
}
