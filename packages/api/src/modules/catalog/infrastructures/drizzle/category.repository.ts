import type { Database } from '@yukinu/db/drizzle'

import { alias, eq } from '@yukinu/db/drizzle'
import { categories } from '@yukinu/db/schema'

import type { CategoryRepository } from '@/modules/catalog/domain/repositories/category.repository'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

import { CategoryEntity } from '@/modules/catalog/domain/entities/category.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleCategoryRepository
  extends DrizzleRepository<CategoryEntity, typeof categories>
  implements CategoryRepository
{
  public constructor(db: Database) {
    super(db, categories, 'id')
  }

  public async findWithParent(
    criterias: AbstractRepository.Criteria<CategoryEntity>[] = [],
    orderBy: Partial<Record<keyof CategoryEntity, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx: Database = this._db,
  ): Promise<CategoryRepository.WithParent[]> {
    const whereClauses = this._buildCriteria(criterias)
    const orderByClause = this._buildOrderBy(orderBy)

    const parent = alias(this._table, 'parent')
    const query = tx
      .select()
      .from(this._table)
      .leftJoin(parent, eq(parent.id, this._table.parentId))
      .$dynamic()

    if (whereClauses) query.where(whereClauses)
    if (orderByClause) query.orderBy(orderByClause)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    const rows = await query

    return rows.map((row) =>
      Object.assign(this._mapToEntity(row.categories), {
        parent: row.parent,
      }),
    )
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof categories>,
  ): CategoryEntity {
    return new CategoryEntity(row)
  }
}
