import type { Database } from '@yukinu/db/drizzle'

import { orders } from '@yukinu/db/schema'

import type { OrderRepository } from '@/modules/checkout/domain/repositories/order.repository'

import { OrderEntity } from '@/modules/checkout/domain/entities/order.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleOrderRepository
  extends DrizzleRepository<OrderEntity, typeof orders, number>
  implements OrderRepository
{
  public constructor(db: Database) {
    super(db, orders, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof orders>,
  ): OrderEntity {
    return new OrderEntity(row)
  }
}
