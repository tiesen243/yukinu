import type { Database, Table, Transaction } from '@yukinu/db/types'
import { eq } from '@yukinu/db'

import type { IBaseRepository } from '../contracts/repositories/base.repository'

export abstract class BaseRepository<TTable extends Table>
  implements IBaseRepository<TTable>
{
  protected _table: TTable = {} as TTable

  constructor(protected _db: Database) {}

  async all(tx = this._db): Promise<TTable['$inferSelect'][]> {
    const records = await tx.select().from(this._table as never)
    return records
  }

  async find(
    id: TTable['id']['dataType'],
    tx = this._db,
  ): Promise<TTable['$inferSelect'] | null> {
    const [record] = (await tx
      .select()
      .from(this._table as never)
      .where(eq(this._table.id, id))
      .limit(1)) as unknown as TTable['$inferSelect'][]
    return record ?? null
  }

  async create(
    data: TTable['$inferInsert'],
    tx = this._db,
  ): Promise<{ id: TTable['id']['dataType'] } | null> {
    const [result] = (await tx
      .insert(this._table as never)
      .values(data)
      .returning({ id: this._table.id })) as { id: TTable['id']['dataType'] }[]
    return result ?? null
  }

  async update(
    id: TTable['id']['dataType'],
    data: Partial<TTable['$inferInsert']>,
    tx = this._db,
  ): Promise<{ id: TTable['id']['dataType'] } | null> {
    const [result] = (await tx
      .update(this._table as never)
      .set(data)
      .where(eq(this._table.id, id))
      .returning({ id: this._table.id })) as { id: TTable['id']['dataType'] }[]
    return result ?? null
  }

  async delete(
    id: TTable['id']['dataType'],
    tx?: Database | Transaction,
  ): Promise<{ id: TTable['id']['dataType'] } | null> {
    const [result] = (await (tx ?? this._db)
      .delete(this._table as never)
      .where(eq(this._table.id, id))
      .returning({ id: this._table.id })) as { id: TTable['id']['dataType'] }[]
    return result ?? null
  }
}
