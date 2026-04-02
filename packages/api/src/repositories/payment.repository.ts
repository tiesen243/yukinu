import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'

import type { IPaymentRepository } from '@/contracts/repositories/payment.repository'

import { BaseRepository } from '@/repositories/base.repository'

export class PaymentRepository
  extends BaseRepository<typeof Schema.payments>
  implements IPaymentRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.payments)
  }
}
