import type { Database } from '@yukinu/db'
import type { users } from '@yukinu/db/schema/user'

import type { IBaseRepository } from '@/types'

export interface IUserRepository extends IBaseRepository<typeof users> {
  deleteSessions(
    userId: IUserRepository.User['id'],
    tx?: Database,
  ): Promise<void>
}

export namespace IUserRepository {
  export type User = typeof users.$inferSelect
  export type NewUser = typeof users.$inferInsert
}
