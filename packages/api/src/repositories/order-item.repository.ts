import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'

import type { IOrderItemRepository } from '@/contracts/repositories/order-item.repository'

import { BaseRepository } from '@/repositories/base.repository'

export class OrderItemRepository
  extends BaseRepository<typeof Schema.orderItems>
  implements IOrderItemRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.orderItems)
  }
}
