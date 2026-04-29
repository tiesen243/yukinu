import type { Database } from '@yukinu/db/drizzle'

import { categories } from '@yukinu/db/schema'

import type { CategoryRepository } from '@/modules/catalog/domain/repositories/category.repository'

import { CategoryEntity } from '@/modules/catalog/domain/entities/category.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleCategoryRepository
  extends DrizzleRepository<CategoryEntity, typeof categories>
  implements CategoryRepository
{
  public constructor(db: Database) {
    super(db, categories, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof categories>,
  ): CategoryEntity {
    return new CategoryEntity(row)
  }
}
