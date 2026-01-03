import type { IUserRepository } from '@/contracts/repositories/user.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'
import type { UserSchema } from '@yukinu/validators/auth'

import { BaseRepository } from '@/repositories/base.repository'

export class UserRepository
  extends BaseRepository<typeof Schema.users>
  implements IUserRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.users)
  }

  async findByIdentifier(
    identifier: Pick<UserSchema, 'email' | 'username'>,
    tx = this._db,
  ): Promise<UserSchema | null> {
    const { eq, or } = this._orm
    const { email, username } = identifier

    const [result] = await tx
      .select()
      .from(this._table)
      .where(
        or(
          eq(this._table.email, email),
          eq(this._table.username, username ?? ''),
        ),
      )
      .limit(1)

    return result ?? null
  }
}
