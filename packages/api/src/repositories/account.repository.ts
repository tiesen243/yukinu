import type { db } from '@yukinu/db'
import { Password } from '@yukinu/auth'
import { accounts } from '@yukinu/db/schema/user'

import { AbstractRepository } from './abstract.repository'

export class AccountRepository extends AbstractRepository {
  private readonly password: Password

  constructor(_db: typeof db) {
    super(_db)
    this.password = new Password()
  }

  async create(
    userId: string,
    provider: string,
    accountId: string,
    password?: string,
  ) {
    let hashedPassword: string | null = null
    if (password) hashedPassword = await this.password.hash(password)

    try {
      await this._db.insert(accounts).values({
        userId,
        provider,
        accountId,
        password: hashedPassword,
      })
      return true
    } catch {
      return false
    }
  }
}
