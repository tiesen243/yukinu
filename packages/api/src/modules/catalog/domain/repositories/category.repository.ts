import type { CategoryEntity } from '@/modules/catalog/domain/entities/category.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface CategoryRepository<
  TTransaction = unknown,
> extends AbstractRepository<CategoryEntity> {
  findWithParent(
    criterias?: AbstractRepository.Criteria<CategoryEntity>[],
    orderBy?: Partial<Record<keyof CategoryEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: TTransaction,
  ): Promise<CategoryRepository.WithParent[]>
}

export namespace CategoryRepository {
  export interface WithParent extends CategoryEntity {
    parent: { id: CategoryEntity['id']; name: CategoryEntity['name'] } | null
  }
}
