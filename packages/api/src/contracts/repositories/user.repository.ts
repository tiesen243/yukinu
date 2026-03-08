import type { Database } from '@yukinu/db'
import type { users } from '@yukinu/db/schema'
import type { UserSchema } from '@yukinu/validators/auth'
import type { ProfileSchema } from '@yukinu/validators/user'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface IUserRepository extends IBaseRepository<typeof users> {
  findByIdentifier(
    identifier: Partial<Pick<UserSchema, 'email' | 'username'>>,
    tx?: Database,
  ): Promise<UserSchema | null>

  findWithProfile(
    id: UserSchema['id'],
    tx?: Database,
  ): Promise<IUserRepository.UserWithProfile | null>
}

export namespace IUserRepository {
  export type UserWithProfile = Omit<UserSchema, 'status' | 'deletedAt'> & {
    profile: Omit<ProfileSchema, 'id'>
  }
}
