import { eq } from '@yukinu/db'
import { profiles } from '@yukinu/db/schema/profile'
import { users } from '@yukinu/db/schema/user'

import type { IUserRepository } from '../contracts/repositories/user.repository'
import { BaseRepository } from './base.repository'

export class UserRepository
  extends BaseRepository<typeof users>
  implements IUserRepository
{
  protected override _table = users

  async findWithProfile(
    userId: string,
    tx = this._db,
  ): Promise<IUserRepository.UserWithProfile | null> {
    const [record] = await tx
      .select({
        id: this._table.id,
        username: this._table.username,
        email: this._table.email,
        emailVerified: this._table.emailVerified,
        role: this._table.role,
        joinedAt: this._table.createdAt,
        profile: {
          avatarUrl: profiles.avatarUrl,
          fullName: profiles.fullName,
          bio: profiles.bio,
          gender: profiles.gender,
          dateOfBirth: profiles.dateOfBirth,
          website: profiles.website,
        },
      })
      .from(this._table)
      .where(eq(this._table.id, userId))
      .innerJoin(profiles, eq(profiles.id, this._table.id))
      .limit(1)

    return record ?? null
  }
}
