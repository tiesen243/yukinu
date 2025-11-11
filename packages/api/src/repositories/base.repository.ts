import type { Database, PgTable, SQL } from '@yukinu/db'
import { and, asc, desc, eq, ilike, or } from '@yukinu/db'

import type { IBaseRepository } from '@/types'

export abstract class BaseRepository<TTable extends PgTable>
  implements IBaseRepository<TTable>
{
  protected _table: TTable = {} as TTable

  constructor(protected _db: Database) {}

  findAll(tx = this._db): Promise<TTable['$inferSelect'][]> {
    return tx.select().from(this._table as never)
  }

  async find(
    id: TTable['$inferSelect']['id'],
    tx = this._db,
  ): Promise<TTable['$inferSelect'] | null> {
    const [record] = (await tx
      .select()
      .from(this._table as never)
      .where(eq(this._table.id, id as unknown as string))
      .limit(1)) as unknown as TTable['$inferSelect'][]
    return record ?? null
  }

  findBy(
    criteria: Partial<TTable['$inferSelect']>[],
    orderBy?: Partial<Record<keyof TTable['$inferSelect'], 'asc' | 'desc'>>,
    limit?: number,
    offset?: number,
    tx = this._db,
  ): Promise<TTable['$inferSelect'][]> {
    const query = tx
      .select()
      .from(this._table as never)
      .$dynamic()

    const whereClause = this.buildCriteria(criteria)
    if (whereClause) query.where(whereClause)

    if (orderBy && Object.keys(orderBy).length > 0) {
      for (const [key, direction] of Object.entries(orderBy)) {
        query.orderBy(
          direction === 'asc'
            ? asc(this._table[key as never])
            : desc(this._table[key as never]),
        )
      }
    }

    if (limit !== undefined) query.limit(limit)
    if (offset !== undefined) query.offset(offset)

    return query
  }

  public count(
    criteria: Partial<TTable['$inferSelect']>[],
    tx = this._db,
  ): Promise<number> {
    const whereClause = this.buildCriteria(criteria)
    return tx.$count(this._table, whereClause)
  }

  public async create(
    data: TTable['$inferInsert'],
    tx = this._db,
  ): Promise<{ id: TTable['$inferSelect']['id'] }> {
    const [result] = await tx
      .insert(this._table as never)
      .values(data)
      .returning({ id: this._table.id })
    if (!result) throw new Error('Failed to create record')
    return result
  }

  public async update(
    id: TTable['$inferSelect']['id'],
    data: Partial<TTable['$inferInsert']>,
    tx = this._db,
  ): Promise<{ id: TTable['$inferSelect']['id'] }> {
    const [result] = await tx
      .update(this._table as never)
      .set(data)
      .where(eq(this._table.id, id as unknown as string))
      .returning({ id: this._table.id })
    if (!result) throw new Error('Failed to update record')
    return result
  }

  public async delete(
    id: TTable['$inferSelect']['id'],
    tx = this._db,
  ): Promise<{ id: TTable['$inferSelect']['id'] }> {
    const [result] = await tx
      .delete(this._table as never)
      .where(eq(this._table.id, id as unknown as string))
      .returning({ id: this._table.id })
    if (!result) throw new Error('Failed to delete record')
    return result
  }

  protected buildCriteria(
    criteria: Partial<TTable['$inferSelect']>[],
  ): SQL | undefined {
    if (criteria.length === 1) {
      const [criterion = {}] = criteria
      return and(
        ...Object.entries(criterion).map(([key, value]) =>
          typeof value === 'string' && value.includes('%')
            ? ilike(this._table[key as never], value)
            : eq(this._table[key as never], value),
        ),
      )
    } else if (criteria.length > 1) {
      const conditions = criteria.map((criterion) =>
        and(
          ...Object.entries(criterion).map(([key, value]) =>
            typeof value === 'string' && value.includes('%')
              ? ilike(this._table[key as never], value)
              : eq(this._table[key as never], value),
          ),
        ),
      )
      return or(...conditions)
    }

    return undefined
  }
}
