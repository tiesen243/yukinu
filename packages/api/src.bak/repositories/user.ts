import type { Database, Transaction } from '@yukinu/db'
import type { users } from '@yukinu/db/schema/user'

import type { IBaseRepository } from './base'

export interface IUserRepository extends IBaseRepository<typeof users> {
  findByIdentifier(
    data: IUserRepository.FindByIdentifierParams,
    tx?: Database | Transaction,
  ): Promise<Pick<typeof users.$inferSelect, 'id'> | null>

  findUserWithProfileById(
    userId: string,
    tx?: Database | Transaction,
  ): Promise<IUserRepository.UserWithProfile | null>

  findUsersBySearchWithPagination(
    search: string,
    page: number,
    limit: number,
    tx?: Database | Transaction,
  ): Promise<IUserRepository.Users>

  countUsersByField<TField extends keyof IUserRepository.User>(
    field: TField,
    value: IUserRepository.User[TField],
    tx?: Database | Transaction,
  ): Promise<number>
}

export declare namespace IUserRepository {
  export type User = typeof users.$inferSelect

  export interface Users {
    users: Omit<User, 'emailVerified'>[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }

  export interface FindByIdentifierParams {
    username?: string
    email?: string
  }

  export interface UserWithProfile
    extends Pick<
      typeof users.$inferSelect,
      'id' | 'username' | 'email' | 'emailVerified' | 'createdAt' | 'updatedAt'
    > {
    emailVerified: Date | null
    fullName: string | null
    gender: string | null
    dateOfBirth: string | null
    website: string | null
    bio: string | null
    avatarUrl: string | null
  }
}
