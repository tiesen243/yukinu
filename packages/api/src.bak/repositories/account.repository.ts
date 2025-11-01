import type { Database, Transaction } from '@yukinu/db'
import type { accounts } from '@yukinu/db/schema/user'
import { and, eq } from '@yukinu/db'

import type { IAccountRepository } from './account'

export class AccountRepository implements IAccountRepository {
  constructor(
    private readonly _db: Database,
    private readonly _table: typeof accounts,
  ) {}

  async findByIdAndProvider(
    id: string,
    provider: string,
    tx: Database | Transaction = this._db,
  ): Promise<IAccountRepository.Accounts | null> {
    const [record] = await tx
      .select()
      .from(this._table)
      .where(
        and(eq(this._table.accountId, id), eq(this._table.provider, provider)),
      )
    return record ?? null
  }

  async create(
    data: typeof accounts.$inferInsert,
    tx: Database | Transaction = this._db,
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

  async updatePassword(
    id: string,
    newPassword: string,
    tx: Database | Transaction = this._db,
  ): Promise<{ userId: string } | null> {
    const [record] = await tx
      .update(this._table)
      .set({ password: newPassword })
      .where(
        and(
          eq(this._table.accountId, id),
          eq(this._table.provider, 'credentials'),
        ),
      )
      .returning({ userId: this._table.userId })
    if (!record?.userId) return null
    return { userId: record.userId }
  }
}
