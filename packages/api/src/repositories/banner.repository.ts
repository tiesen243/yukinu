import type { IBannerRepository } from '@/contracts/repositories/banner.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'

import { BaseRepository } from '@/repositories/base.repository'

export class BannerRepository
  extends BaseRepository<typeof Schema.banners>
  implements IBannerRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.banners)
  }
}
