import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'

import { BaseRepository } from '@/repositories/base.repository'

export class ProfileRepository
  extends BaseRepository<typeof Schema.profiles>
  implements ProfileRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.profiles)
  }
}
