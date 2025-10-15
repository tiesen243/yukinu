import type { Database, Transaction } from '@yukinu/db'
import { accounts } from '@yukinu/db/schema/user'

import type { IAccountRepository } from './account'

export class AccountRepository implements IAccountRepository {
  constructor(private readonly _db: Database) {}

  async create(
    data: IAccountRepository.CreateParams,
    tx: Database | Transaction = this._db,
  ): Promise<boolean> {
    try {
      await tx.insert(accounts).values(data)
      return true
    } catch {
      return false
    }
  }
}
