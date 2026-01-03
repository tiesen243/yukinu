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

  all(tx = this._db): Promise<T['$inferSelect'][]> {
    return tx.select().from(this._table as never)
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
}
