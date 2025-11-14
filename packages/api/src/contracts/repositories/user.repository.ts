import type { Database } from '@yukinu/db'
import type { User, users } from '@yukinu/db/schema/user'

import type { IBaseRepository } from '@/types'

export interface IUserRepository extends IBaseRepository<typeof users> {
  deleteSessions(userId: User['id'], tx?: Database): Promise<void>
}

export namespace IUserRepository {
  export type User = typeof users.$inferSelect
  export type NewUser = typeof users.$inferInsert
}
