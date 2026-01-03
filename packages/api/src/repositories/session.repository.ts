import type { ISessionRepository } from '@/contracts/repositories/session.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'

import { BaseRepository } from '@/repositories/base.repository'

export class SessionRepository
  extends BaseRepository<typeof Schema.sessions>
  implements ISessionRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.sessions)
  }
}
