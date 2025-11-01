import type { Database, Transaction } from '@yukinu/db'
import type { accounts } from '@yukinu/db/schema/user'

import type { IAccountRepository } from './account'

export class AccountRepositoryMock implements IAccountRepository {
  constructor(
    private readonly _db: Database,
    private readonly _table: typeof accounts,
  ) {}

  findByIdAndProvider(
    _id: string,
    _provider: string,
    _tx?: Database | Transaction,
  ): Promise<IAccountRepository.Accounts | null> {
    throw new Error('Method not implemented.')
  }

  async create(
    _data: typeof accounts.$inferInsert,
    _tx?: Database | Transaction,
  ): Promise<{ userId: string } | null> {
    return Promise.resolve({ userId: 'mock-user-id' })
  }

  updatePassword(
    _id: string,
    _newPassword: string,
    _tx?: Database | Transaction,
  ): Promise<{ userId: string } | null> {
    throw new Error('Method not implemented.')
  }
}
