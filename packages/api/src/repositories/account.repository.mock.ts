import type { Database, Transaction } from '@yukinu/db'
import type { accounts } from '@yukinu/db/schema/user'

import type { IAccountRepository } from './account'

export class AccountRepositoryMock implements IAccountRepository {
  constructor(
    private readonly _db: Database,
    private readonly _table: typeof accounts,
  ) {}

  async create(
    _data: typeof accounts.$inferInsert,
    _tx?: Database | Transaction,
  ): Promise<{ userId: string } | null> {
    return Promise.resolve({ userId: 'mock-user-id' })
  }
}
