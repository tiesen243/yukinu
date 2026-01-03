import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { sessions } from '@yukinu/db/schema'
import type { SessionSchema, UserSchema } from '@yukinu/validators/auth'

export interface ISessionRepository extends IBaseRepository<typeof sessions> {
  findWithUser(): Promise<
    Omit<SessionSchema, 'id' | 'userId' | 'createdAt'> & {
      user: Pick<UserSchema, 'id' | 'username' | 'email' | 'role' | 'image'>
    }
  >
}
