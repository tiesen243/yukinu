import type { Database, Transaction } from '@yukinu/db'
import type { users } from '@yukinu/db/schema/user'

import type { IBaseRepository } from './base'

export interface IUserRepository extends IBaseRepository<typeof users> {
  findByIdentifier(
    data: IUserRepository.FindByIndentifierParams,
    tx?: Database | Transaction,
  ): Promise<Pick<typeof users.$inferSelect, 'id'> | null>

  findWithProfileById(
    userId: string,
    tx?: Database | Transaction,
  ): Promise<IUserRepository.UserWithProfile | null>
}

export declare namespace IUserRepository {
  export interface FindByIndentifierParams {
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
