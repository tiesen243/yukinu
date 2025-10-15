import type { Database, Transaction } from '@yukinu/db'
import { eq, or } from '@yukinu/db'
import { users } from '@yukinu/db/schema/user'

import type { IUserRepository } from './user'
import { BaseRepository } from './base.repository'

export class UserRepository
  extends BaseRepository<typeof users>
  implements IUserRepository
{
  async findByIdentifier(
    data: IUserRepository.FindByIndentifierParams,
    tx: Database | Transaction = this._db,
  ): Promise<string | null> {
    const { username, email } = data
    if (!username && !email) return null

    const [user] = await tx
      .select({ id: users.id })
      .from(users)
      .where(
        or(
          username ? eq(users.username, username) : undefined,
          email ? eq(users.email, email) : undefined,
        ),
      )

    if (!user) return null
    return user.id
  }
}
