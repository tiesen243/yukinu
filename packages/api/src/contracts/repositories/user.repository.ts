import type { Profile } from '@yukinu/db/schema/profile'
import type { User, users } from '@yukinu/db/schema/user'
import type { Database, Transaction } from '@yukinu/db/types'

import type { IBaseRepository } from './base.repository'

export interface IUserRepository extends IBaseRepository<typeof users> {
  findWithProfile(
    userId: string,
    tx?: Database | Transaction,
  ): Promise<IUserRepository.UserWithProfile | null>
}

export declare namespace IUserRepository {
  export type UserType = User

  export interface UserWithProfile {
    id: User['id']
    username: User['username']
    email: User['email']
    emailVerified: User['emailVerified']
    role: User['role']
    joinedAt: User['createdAt']
    profile: {
      avatarUrl: Profile['avatarUrl']
      fullName: Profile['fullName']
      bio: Profile['bio']
      gender: Profile['gender']
      dateOfBirth: Profile['dateOfBirth']
      website: Profile['website']
    }
  }
}
