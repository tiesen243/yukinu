import type { CategoryEntity } from '@/modules/catalog/domain/entities/category.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface CategoryRepository extends AbstractRepository<CategoryEntity> {}
