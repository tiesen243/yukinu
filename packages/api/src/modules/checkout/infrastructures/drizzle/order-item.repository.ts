import type { Database } from '@yukinu/db/drizzle'

import { orderItems } from '@yukinu/db/schema'

import type { OrderItemRepository } from '@/modules/checkout/domain/repositories/order-item.repository'

import { OrderItemEntity } from '@/modules/checkout/domain/entities/order-item.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleOrderItemRepository
  extends DrizzleRepository<OrderItemEntity, typeof orderItems>
  implements OrderItemRepository
{
  public constructor(db: Database) {
    super(db, orderItems, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof orderItems>,
  ): OrderItemEntity {
    return new OrderItemEntity(row)
  }
}
