import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { Database } from '@yukinu/db'
import type { sessions } from '@yukinu/db/schema'
import type { SessionSchema, UserSchema } from '@yukinu/validators/auth'

export interface ISessionRepository extends IBaseRepository<typeof sessions> {
  allByUserId(userId: UserSchema['id'], tx?: Database): Promise<SessionSchema[]>
}
