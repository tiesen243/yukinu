import type { addresses } from '@yukinu/db/schema/profile'

import type { IBaseRepository } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAddressRepository extends IBaseRepository<typeof addresses> {}

export namespace IAddressRepository {
  export type Address = typeof addresses.$inferSelect
  export type NewAddress = typeof addresses.$inferInsert
}
