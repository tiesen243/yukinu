import type { Database, Table, Transaction } from '@yukinu/db'
import { eq } from '@yukinu/db'

import type { IBaseRepository } from './base'

export abstract class BaseRepository<TTable extends Table>
  implements IBaseRepository<TTable>
{
  constructor(
    protected readonly _db: Database,
    protected readonly _table: TTable,
  ) {}

  async findAll(
    tx: Database | Transaction = this._db,
  ): Promise<TTable['$inferSelect'][]> {
    // @ts-expect-error [drizzle-generic] - Drizzle cannot infer generic `TTable` in `.from()`; requires a concrete table type
    const records = await tx.select().from(this._table)
    return records
  }

  async findById(
    id: string,
    tx: Database | Transaction = this._db,
  ): Promise<TTable['$inferSelect'] | null> {
    const [record] = await tx
      .select()
      // @ts-expect-error [drizzle-generic] - Drizzle cannot infer generic `TTable` in `.from()`; requires a concrete table type
      .from(this._table)
      .where(eq(this._table.id, id))
    return record ?? null
  }

  async create(
    data: TTable['$inferInsert'],
    tx: Database | Transaction = this._db,
  ): Promise<{ id: string } | null> {
    try {
      // @ts-expect-error [drizzle-generic] - Insert type not inferable in generic context; safe to ignore
      const [record] = await tx.insert(this._table).values(data).returning({
        id: this._table.id,
      })
      if (!record?.id) throw new Error('Failed to create record')
      return { id: record.id }
    } catch {
      return null
    }
  }

  async update(
    id: string,
    data: Partial<TTable['$inferInsert']>,
    tx: Database | Transaction = this._db,
  ): Promise<{ id: string } | null> {
    try {
      const [record] = await tx
        .update(this._table)
        // @ts-expect-error [drizzle-generic] - Update type not inferable in generic context; safe to ignore
        .set(data)
        .where(eq(this._table.id, id))
        .returning({ id: this._table.id })
      if (!record?.id) throw new Error('Failed to update record')
      return { id: record.id }
    } catch {
      return null
    }
  }

  async delete(
    id: string,
    tx: Database | Transaction = this._db,
  ): Promise<{ id: string } | null> {
    try {
      const [record] = await tx
        .delete(this._table)
        .where(eq(this._table.id, id))
        .returning({ id: this._table.id })
      if (!record?.id) throw new Error('Failed to delete record')
      return { id: record.id }
    } catch {
      return null
    }
  }
}
