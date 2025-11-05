import type { Database } from '@yukinu/db'
import type { Profile } from '@yukinu/db/schema/profile'
import type { NewUser, User, users } from '@yukinu/db/schema/user'

import type { IBaseRepository } from '@/types'

export interface IUserRepository extends IBaseRepository<typeof users> {
  findWithProfile(
    userId: string,
    tx?: Database,
  ): Promise<IUserRepository.UserWithProfile | null>
}

export declare namespace IUserRepository {
  export type UserType = User
  export type NewUserType = NewUser

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
