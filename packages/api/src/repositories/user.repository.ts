import type { Database, Transaction } from '@yukinu/db'
import { eq, or } from '@yukinu/db'
import { profiles } from '@yukinu/db/schema/profile'
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
  ): Promise<Pick<typeof users.$inferSelect, 'id'> | null> {
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
    return user
  }

  async findWithProfileById(
    userId: string,
    tx: Database | Transaction = this._db,
  ): Promise<IUserRepository.UserWithProfile | null> {
    const [user] = await tx
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        emailVerified: users.emailVerified,
        fullName: profiles.fullName,
        gender: profiles.gender,
        dateOfBirth: profiles.dateOfBirth,
        website: profiles.website,
        bio: profiles.bio,
        avatarUrl: profiles.avatarUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .innerJoin(profiles, eq(profiles.id, users.id))
      .limit(1)

    if (!user) return null
    return user
  }
}
