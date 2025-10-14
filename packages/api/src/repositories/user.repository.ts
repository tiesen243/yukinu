import { eq, or } from '@yukinu/db'
import { users } from '@yukinu/db/schema/user'

import { AbstractRepository } from './abstract.repository'

export class UserRepository extends AbstractRepository {
  async findByIndentifier(username?: string, email?: string) {
    const [user] = await this._db
      .select()
      .from(users)
      .where(
        or(eq(users.username, username ?? ''), eq(users.email, email ?? '')),
      )
    return user ?? null
  }

  async create(username: string, email: string) {
    try {
      const [newUser] = await this._db
        .insert(users)
        .values({ username, email })
        .returning({ id: users.id, username: users.username })
      if (!newUser) return null

      return newUser
    } catch {
      return null
    }
  }
}
