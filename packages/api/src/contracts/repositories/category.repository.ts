import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { Database } from '@yukinu/db'
import type { categories } from '@yukinu/db/schema'
import type { CategorySchema } from '@yukinu/validators/general'

export interface ICategoryRepository extends IBaseRepository<
  typeof categories
> {
  allWithParent(
    criterias?: Partial<CategorySchema>[],
    orderBy?: Partial<Record<keyof CategorySchema, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: Database,
  ): Promise<
    (Pick<CategorySchema, 'id' | 'name'> & {
      parent: Pick<CategorySchema, 'id' | 'name'> | null
    })[]
  >

  findWithParent(
    id: CategorySchema['id'],
    tx?: Database,
  ): Promise<
    | (Omit<CategorySchema, 'parentId'> & {
        parent: Pick<CategorySchema, 'id' | 'name'> | null
      })
    | null
  >
}
