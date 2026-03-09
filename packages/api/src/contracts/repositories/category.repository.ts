import type { Database } from '@yukinu/db'
import type { categories } from '@yukinu/db/schema'
import type { CategorySchema } from '@yukinu/validators/general'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface ICategoryRepository extends IBaseRepository<
  typeof categories
> {
  allWithParent(
    criterias?: Partial<CategorySchema>[],
    orderBy?: Partial<Record<keyof CategorySchema, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: Database,
  ): Promise<ICategoryRepository.CategoryWithParent[]>

  findWithParent(
    id: CategorySchema['id'],
    tx?: Database,
  ): Promise<ICategoryRepository.CategoryWithParent | null>
}

export namespace ICategoryRepository {
  export type CategoryWithParent = Omit<CategorySchema, 'parentId'> & {
    parent: Pick<CategorySchema, 'id' | 'name'> | null
  }
}
