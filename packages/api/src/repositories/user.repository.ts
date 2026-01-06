import type { IUserRepository } from '@/contracts/repositories/user.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'
import type { UserSchema } from '@yukinu/validators/auth'
import type { Gender, ProfileSchema } from '@yukinu/validators/user'

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

  async findWithProfile(
    id: UserSchema['id'],
    tx = this._db,
  ): Promise<
    | (Omit<UserSchema, 'status' | 'deletedAt'> & {
        profile: Omit<ProfileSchema, 'id'>
      })
    | null
  > {
    const { eq, sql } = this._orm
    const { profiles } = this._schema

    const [result] = await tx
      .select({
        id: this._table.id,
        username: this._table.username,
        email: this._table.email,
        emailVerified: this._table.emailVerified,
        image: this._table.image,
        role: this._table.role,
        createdAt: this._table.createdAt,
        updatedAt: this._table.updatedAt,
        profile: {
          fullName: profiles.fullName,
          bio: profiles.bio,
          banner: profiles.banner,
          gender: sql<Gender | null>`${profiles.gender}`,
          dateOfBirth: profiles.dateOfBirth,
        },
      })
      .from(this._table)
      .where(eq(this._table.id, id))
      .innerJoin(profiles, eq(profiles.id, this._table.id))
      .limit(1)

    return result ?? null
  }
}
