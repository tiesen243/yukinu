import type { Database } from '@yukinu/db'
import type { accounts } from '@yukinu/db/schema/user'

import type { IAccountRepository } from './account'

export class AccountRepository implements IAccountRepository {
  constructor(
    private readonly _db: Database,
    private readonly _table: typeof accounts,
  ) {}

  async create(
    data: typeof accounts.$inferInsert,
    tx = this._db,
  ): Promise<{ userId: string } | null> {
    try {
      const [record] = await tx
        .insert(this._table)
        .values(data)
        .returning({ userId: this._table.userId })
      if (!record?.userId) return null
      return { userId: record.userId }
    } catch {
      return null
    }
  }
}
