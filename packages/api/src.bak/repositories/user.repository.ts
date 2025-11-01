import type { Database, Transaction } from '@yukinu/db'
import { and, desc, eq, ilike, or } from '@yukinu/db'
import { profiles } from '@yukinu/db/schema/profile'
import { users } from '@yukinu/db/schema/user'

import type { IUserRepository } from './user'
import { BaseRepository } from './base.repository'

export class UserRepository
  extends BaseRepository<typeof users>
  implements IUserRepository
{
  async findUsersBySearchWithPagination(
    search = '',
    page = 1,
    limit = 10,
    tx: Database | Transaction = this._db,
  ): Promise<IUserRepository.Users> {
    const filters = or(
      ilike(users.username, `%${search}%`),
      ilike(users.email, `%${search}%`),
    )

    const userList = await tx
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(search ? filters : undefined)
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy(desc(users.createdAt))

    const total = await tx.$count(users, search ? filters : undefined)
    const totalPages = Math.ceil(total / limit)

    return {
      users: userList,
      pagination: { total, page, limit, totalPages },
    }
  }

  async findByIdentifier(
    data: IUserRepository.FindByIdentifierParams,
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

  async findUserWithProfileById(
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

  countUsersByField<TField extends keyof IUserRepository.User>(
    field: TField,
    value: IUserRepository.User[TField],
    tx: Database | Transaction = this._db,
  ): Promise<number> {
    const count = tx.$count(
      this._table,
      // @ts-expect-error: Dynamic field access
      and(eq(this._table[field], value), eq(this._table.status, 'active')),
    )
    return count
  }
}
