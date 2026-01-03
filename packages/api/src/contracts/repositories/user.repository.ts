import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { Database } from '@yukinu/db'
import type { users } from '@yukinu/db/schema'
import type { UserSchema } from '@yukinu/validators/auth'

export interface IUserRepository extends IBaseRepository<typeof users> {
  findByIdentifier(
    identifier: Pick<UserSchema, 'email' | 'username'>,
    tx?: Database,
  ): Promise<UserSchema | null>
}
