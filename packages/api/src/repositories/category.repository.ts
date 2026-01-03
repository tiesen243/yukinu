import type { ICategoryRepository } from '@/contracts/repositories/category.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'
import type { CategorySchema } from '@yukinu/validators/general'

import { alias } from '@yukinu/db'

import { BaseRepository } from '@/repositories/base.repository'

export class CategoryRepository
  extends BaseRepository<typeof Schema.categories>
  implements ICategoryRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.categories)
  }

  allWithParent(
    criterias: Partial<CategorySchema>[] = [],
    orderBy: Partial<Record<keyof CategorySchema, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx = this._db,
  ): Promise<
    (Pick<CategorySchema, 'id' | 'name'> & {
      parent: Pick<CategorySchema, 'id' | 'name'> | null
    })[]
  > {
    const whereClause = this._buildCriteria(criterias)
    const orderByClause = this._buildOrderBy(orderBy)

    const parent = alias(this._table, 'parent')
    const query = tx
      .select({
        id: this._table.id,
        name: this._table.name,
        parent: { id: parent.id, name: parent.name },
      })
      .from(this._table)
      .leftJoin(parent, this._orm.eq(this._table.parentId, parent.id))
      .$dynamic()

    if (whereClause) query.where(whereClause)
    if (orderByClause) query.orderBy(orderByClause)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    return query
  }

  async findWithParent(
    id: CategorySchema['id'],
    tx = this._db,
  ): Promise<
    | (Omit<CategorySchema, 'parentId'> & {
        parent: Pick<CategorySchema, 'id' | 'name'> | null
      })
    | null
  > {
    const parent = alias(this._table, 'parent')

    const [result] = await tx
      .select({
        id: this._table.id,
        name: this._table.name,
        description: this._table.description,
        image: this._table.image,
        parent: { id: parent.id, name: parent.name },
      })
      .from(this._table)
      .leftJoin(parent, this._orm.eq(this._table.parentId, parent.id))
      .where(this._orm.eq(this._table.id, id))

    return result ?? null
  }
}
