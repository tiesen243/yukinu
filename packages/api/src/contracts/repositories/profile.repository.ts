import type { profiles } from '@yukinu/db/schema/profile'

import type { IBaseRepository } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IProfileRepository extends IBaseRepository<typeof profiles> {}

export namespace IProfileRepository {
  export type Profile = typeof profiles.$inferSelect
  export type NewProfile = typeof profiles.$inferInsert
}
