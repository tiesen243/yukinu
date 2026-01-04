import type { IAddressRepository } from '@/contracts/repositories/address.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'

import { BaseRepository } from '@/repositories/base.repository'

export class AddressRepository
  extends BaseRepository<typeof Schema.addresses>
  implements IAddressRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.addresses)
  }
}
