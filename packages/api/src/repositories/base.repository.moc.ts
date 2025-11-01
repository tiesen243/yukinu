import type { Database, Table } from '@yukinu/db/types'

import type { IBaseRepository } from '../contracts/repositories/base.repository'

export abstract class BaseRepository<TTable extends Table>
  implements IBaseRepository<TTable>
{
  protected _table: TTable = {} as TTable
  private data: TTable['$inferSelect'][] = []
  private idCounter = 1

  constructor(protected _db: Database = {} as Database) {}

  async all(_tx = this._db): Promise<TTable['$inferSelect'][]> {
    return Promise.resolve([...this.data])
  }

  async find(
    id: TTable['$inferSelect']['id'],
    _tx = this._db,
  ): Promise<TTable['$inferSelect'] | null> {
    const row = this.data.filter(
      (item) => item.id === id,
    ) as unknown as TTable['$inferSelect'][]
    return Promise.resolve(row[0] ?? null)
  }

  async create(
    data: TTable['$inferInsert'],
    _tx = this._db,
  ): Promise<{ id: TTable['$inferSelect']['id'] } | null> {
    const id = String(this.idCounter++) as TTable['$inferSelect']['id']
    const row = { ...data, id } as TTable['$inferSelect']
    this.data.push(row)

    return Promise.resolve({ id })
  }

  async update(
    id: TTable['$inferSelect']['id'],
    data: Partial<TTable['$inferInsert']>,
    _tx = this._db,
  ): Promise<{ id: TTable['$inferSelect']['id'] } | null> {
    const idx = this.data.findIndex(
      (row: TTable['$inferSelect']) => row.id === id,
    )
    if (idx === -1) return null
    this.data[idx] = { ...this.data[idx], ...data } as TTable['$inferSelect']

    return Promise.resolve({ id })
  }

  async delete(
    id: TTable['$inferSelect']['id'],
    _tx = this._db,
  ): Promise<{ id: TTable['$inferSelect']['id'] } | null> {
    const idx = this.data.findIndex(
      (row: TTable['$inferSelect']) => row.id === id,
    )
    if (idx === -1) return null
    this.data.splice(idx, 1)

    return Promise.resolve({ id })
  }
}
