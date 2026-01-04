import type { IAccountRepository } from '@/contracts/repositories/account.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'
import type { AccountSchema } from '@yukinu/validators/auth'

import { BaseRepository } from '@/repositories/base.repository'

export class AccountRepository
  extends BaseRepository<typeof Schema.accounts>
  implements IAccountRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.accounts)
  }

  override async find(
    id: AccountSchema['id'],
    tx = this._db,
  ): Promise<AccountSchema | null> {
    const { eq, and } = this._orm

    const [result] = await tx
      .select()
      .from(this._table)
      .where(
        and(
          eq(this._table.accountId, id),
          eq(this._table.provider, 'credentials'),
        ),
      )
      .limit(1)

    return result ?? null
  }

  override async update(
    id: AccountSchema['id'],
    data: Partial<AccountSchema>,
    tx = this._db,
  ): Promise<string> {
    const { and, eq } = this._orm

    const [result] = await tx
      .update(this._table)
      .set(data)
      .where(
        and(
          eq(this._table.userId, id),
          eq(this._table.provider, 'credentials'),
        ),
      )
      .returning({ userId: this._table.userId })

    return result ? result.userId : ''
  }
}
