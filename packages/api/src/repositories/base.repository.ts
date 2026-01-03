import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { Database, PgTable, orm } from '@yukinu/db'
import type * as schema from '@yukinu/db/schema'

export abstract class BaseRepository<
  T extends PgTable,
> implements IBaseRepository<T> {
  constructor(
    protected _db: Database,
    protected _orm: typeof orm,
    protected _schema: typeof schema,
    protected _table: T,
  ) {}

  all(
    criterias: Partial<T['$inferSelect']>[] = [],
    orderBy: Partial<Record<keyof T['$inferSelect'], 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx = this._db,
  ): Promise<T['$inferSelect'][]> {
    const whereClause = this._buildCriteria(criterias)
    const orderByClause = this._buildOrderBy(orderBy)

    const query = tx
      .select()
      .from(this._table as never)
      .$dynamic()

    if (whereClause) query.where(whereClause)
    if (orderByClause) query.orderBy(orderByClause)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    return query
  }

  async find(
    id: T['$inferSelect']['id'],
    tx = this._db,
  ): Promise<T['$inferSelect'] | null> {
    const { eq } = this._orm

    const [result] = await tx
      .select()
      .from(this._table as never)
      .where(eq(this._table.id, id as never))
      .limit(1)

    return result ?? null
  }

  count(
    criterias?: Partial<T['$inferSelect']>[] | undefined,
    tx = this._db,
  ): Promise<number> {
    const whereClause = this._buildCriteria(criterias ?? [])
    return tx.$count(this._table, whereClause)
  }

  async create(
    data: T['$inferInsert'],
    tx = this._db,
  ): Promise<T['$inferSelect']['id']> {
    const [result] = await tx
      .insert(this._table)
      .values(data as never)
      .returning({ id: this._table.id })

    return result ? result.id : ''
  }

  async createMany(
    data: T['$inferInsert'][],
    tx = this._db,
  ): Promise<T['$inferSelect']['id'][]> {
    const result = await tx
      .insert(this._table)
      .values(data as never)
      .returning({ id: this._table.id })

    return result.length <= 0 ? result.map((row) => row.id) : []
  }

  async update(
    id: T['$inferSelect']['id'],
    data: Partial<T['$inferSelect']>,
    tx = this._db,
  ): Promise<T['$inferSelect']['id']> {
    const { eq } = this._orm

    const [result] = await tx
      .update(this._table)
      .set(data as never)
      .where(eq(this._table.id, id as never))
      .returning({ id: this._table.id })

    return result ? result.id : ''
  }

  async updateMany(
    ids: T['$inferSelect']['id'][],
    data: Partial<T['$inferSelect']>,
    tx?: Database,
  ): Promise<T['$inferSelect']['id'][]> {
    const { inArray } = this._orm

    const result = await (tx ?? this._db)
      .update(this._table)
      .set(data as never)
      .where(inArray(this._table.id, ids as never[]))
      .returning({ id: this._table.id })

    return result.length <= 0 ? result.map((row) => row.id) : []
  }

  async delete(
    id: T['$inferSelect']['id'],
    tx = this._db,
  ): Promise<T['$inferSelect']['id']> {
    const { eq } = this._orm

    const [result] = await tx
      .delete(this._table)
      .where(eq(this._table.id, id as never))
      .returning({ id: this._table.id })

    return result ? result.id : ''
  }

  async deleteMany(
    ids: T['$inferSelect']['id'][],
    tx?: Database,
  ): Promise<T['$inferSelect']['id'][]> {
    const { inArray } = this._orm

    const result = await (tx ?? this._db)
      .delete(this._table)
      .where(inArray(this._table.id, ids as never[]))
      .returning({ id: this._table.id })

    return result.length <= 0 ? result.map((row) => row.id) : []
  }

  /*
   * @example 1
   * const criteria = this._buildCriteria([
   *   { name: 'example', age: 25 },
   *   { isActive: true },
   * ])
   * --> (name = 'example' AND age = 25) OR isActive = true
   *
   * @example 2
   * const criteria = this._buildCriteria([
   *   { category: '!books', deletedAt: 'not null' },
   * ])
   * --> category != 'books' AND deletedAt IS NOT NULL
   *
   * @example 3
   * const criteria = this._buildCriteria([
   *  { price: '>10' },
   *  { stock: '<=5' },
   * ])
   * --> price > 10 OR stock <= 5
   */
  protected _buildCriteria(
    criterias: Partial<T['$inferSelect']>[],
  ): orm.SQL | undefined {
    const { and, or } = this._orm

    if (criterias.length === 0) return undefined

    const expressions = criterias.map((criteria) => {
      const fields = Object.entries(criteria).map(([field, value]) =>
        this._parseCondition(field as keyof T, value),
      )
      return and(...fields)
    })

    return expressions.length === 1 ? expressions[0] : or(...expressions)
  }

  private _parseCondition<V>(field: keyof T, value: V): orm.SQL {
    const { eq, ne, isNotNull, isNull, lte, lt, gt, gte } = this._orm

    if (typeof value !== 'string') return eq(this._table[field] as never, value)

    if (value.startsWith('!'))
      return ne(this._table[field] as never, value.slice(1))

    if (value === 'not null') return isNotNull(this._table[field] as never)
    if (value === 'null') return isNull(this._table[field] as never)

    if (value.startsWith('>='))
      return gte(this._table[field] as never, value.slice(2))
    if (value.startsWith('>'))
      return gt(this._table[field] as never, value.slice(1))
    if (value.startsWith('<='))
      return lte(this._table[field] as never, value.slice(2))
    if (value.startsWith('<'))
      return lt(this._table[field] as never, value.slice(1))

    return eq(this._table[field] as never, value)
  }

  /*
   * @example
   * const orderBy = this._buildOrderBy({ name: 'asc', createdAt: 'desc' })
   * --> ORDER BY name ASC, createdAt DESC
   */
  protected _buildOrderBy(
    orderBy: Partial<Record<keyof T['$inferSelect'], 'asc' | 'desc'>>,
  ): orm.SQL | undefined {
    const { and, asc, desc } = this._orm

    if (Object.keys(orderBy).length === 0) return undefined

    const conditions = Object.entries(orderBy).map(([field, direction]) =>
      direction === 'asc'
        ? asc(this._table[field as keyof T] as never)
        : desc(this._table[field as keyof T] as never),
    )

    return conditions.length === 1 ? conditions[0] : and(...conditions)
  }
}
