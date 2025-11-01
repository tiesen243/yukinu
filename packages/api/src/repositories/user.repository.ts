import { eq, ilike, or } from '@yukinu/db'
import { profiles } from '@yukinu/db/schema/profile'
import { users } from '@yukinu/db/schema/user'

import type { IUserRepository } from '../contracts/repositories/user.repository'
import { BaseRepository } from './base.repository'

export class UserRepository
  extends BaseRepository<typeof users>
  implements IUserRepository
{
  protected override _table = users

  async findByQueryWithPagination(
    params: IUserRepository.FindByQueryWithPaginationParams,
    tx = this._db,
  ): Promise<IUserRepository.FindByQueryWithPaginationResult> {
    const offset = (params.page - 1) * params.limit
    const whereClause = or(
      ilike(this._table.username, `%${params.search}%`),
      ilike(this._table.email, `%${params.search}%`),
    )

    const records = await tx
      .select()
      .from(this._table)
      .where(whereClause)
      .limit(params.limit)
      .offset(offset)

    const total = await tx.$count(this._table, whereClause)
    const totalPages = Math.ceil(total / params.limit)

    return {
      users: records,
      pagination: { page: params.page, total, totalPages },
    }
  }

  async findByIdentifier(
    params: IUserRepository.FindByIdentifierParams,
    tx = this._db,
  ): Promise<IUserRepository.FindByIdentifierResult> {
    const whereClause = or(
      eq(this._table.username, params.username),
      eq(this._table.email, params.email),
    )

    const [record] = await tx
      .select()
      .from(this._table)
      .where(whereClause)
      .limit(1)
    return record ?? null
  }

  async findByIdWithProfile(
    userId: string,
    tx = this._db,
  ): Promise<IUserRepository.FindByIdWithProfileResult> {
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
