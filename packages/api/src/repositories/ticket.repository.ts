import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'

import type { ITicketRepository } from '@/contracts/repositories/ticket.repository'

import { BaseRepository } from '@/repositories/base.repository'

export class TicketRepository
  extends BaseRepository<typeof Schema.tickets>
  implements ITicketRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.tickets)
  }
}
