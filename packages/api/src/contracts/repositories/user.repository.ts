import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { Database } from '@yukinu/db'
import type { users } from '@yukinu/db/schema'
import type { UserSchema } from '@yukinu/validators/auth'
import type { ProfileSchema } from '@yukinu/validators/user'

export interface IUserRepository extends IBaseRepository<typeof users> {
  findByIdentifier(
    identifier: Pick<UserSchema, 'email' | 'username'>,
    tx?: Database,
  ): Promise<UserSchema | null>

  findWithProfile(
    id: UserSchema['id'],
    tx?: Database,
  ): Promise<
    | (Omit<UserSchema, 'status' | 'deletedAt'> & {
        profile: Omit<ProfileSchema, 'id'>
      })
    | null
  >
}
