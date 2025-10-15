import type { Database, Transaction } from '@yukinu/db'
import { eq, or } from '@yukinu/db'
import { users } from '@yukinu/db/schema/user'

import type { IUserRepository } from './user'

export class UserRepository implements IUserRepository {
  constructor(private readonly _db: Database) {}

  async findByIdentifier(
    data: IUserRepository.FindByIndentifierParams,
    tx: Database | Transaction = this._db,
  ): Promise<string | null> {
    const { username = '', email = '' } = data

    const [user] = await tx
      .select({ id: users.id })
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, email)))
    return user?.id ?? null
  }

  async create(
    data: IUserRepository.CreateParams,
    tx: Database | Transaction = this._db,
  ): Promise<string | null> {
    const { username, email } = data

    try {
      const [newUser] = await tx
        .insert(users)
        .values({ username, email })
        .returning({ id: users.id })
      if (!newUser) return null
      return newUser.id
    } catch {
      return null
    }
  }
}
