import type { Database } from '@yukinu/db/drizzle'

import type { AllOrdersDto } from '@/modules/checkout/application/dtos/order/all-orders.dto'
import type { OneOrderDto } from '@/modules/checkout/application/dtos/order/one-order.dto'
import type { OrderEntity } from '@/modules/checkout/domain/entities/order.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface OrderRepository extends AbstractRepository<
  OrderEntity,
  number
> {
  findWithItems(
    criterias?: AbstractRepository.Criteria<OrderEntity>[],
    orderBy?: Partial<Record<keyof OrderEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: Database,
  ): Promise<AllOrdersDto.Output['orders']>

  oneWithDetails(
    criteria: AbstractRepository.Criteria<OrderEntity>,
    tx?: Database,
  ): Promise<OneOrderDto.Output | null>
}
