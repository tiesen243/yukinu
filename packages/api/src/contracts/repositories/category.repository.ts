import type { categories } from '@yukinu/db/schema/product'

import type { IBaseRepository } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICategoryRepository extends IBaseRepository<
  typeof categories
> {}

export namespace ICategoryRepository {
  export type Category = typeof categories.$inferSelect
  export type NewCategory = typeof categories.$inferInsert
}
