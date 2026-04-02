import type { Database } from '@yukinu/db'
import type { sessions } from '@yukinu/db/schema'
import type { SessionSchema, UserSchema } from '@yukinu/validators/auth'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface ISessionRepository extends IBaseRepository<typeof sessions> {
  allByUserId(
    userId: UserSchema['id'],
    tx?: Database,
  ): Promise<Omit<SessionSchema, 'userId' | 'token'>[]>
}
