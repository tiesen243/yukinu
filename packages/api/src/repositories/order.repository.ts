import type { IOrderRepository } from '@/contracts/repositories/order.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'

import { BaseRepository } from '@/repositories/base.repository'

export class OrderRepository
  extends BaseRepository<typeof Schema.orders>
  implements IOrderRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.orders)
  }
}
