import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'

import type { IVoucherRepository } from '@/contracts/repositories/voucher.repository'

import { BaseRepository } from '@/repositories/base.repository'

export class VoucherRepository
  extends BaseRepository<typeof Schema.vouchers>
  implements IVoucherRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.vouchers)
  }
}
