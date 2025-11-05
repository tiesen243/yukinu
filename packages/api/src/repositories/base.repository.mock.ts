import type { Database, Table, Transaction } from '@yukinu/db/types'

import type { IBaseRepository } from '@/types'

export abstract class BaseRepository<TTable extends Table>
  implements IBaseRepository<TTable>
{
  protected _data: TTable['$inferSelect'][] = []
  protected static _idCounter = 1

  findAll(_tx?: Database | Transaction): Promise<TTable['$inferSelect'][]> {
    return Promise.resolve(this._data)
  }

  find(
    id: TTable['$inferSelect']['id'],
    _tx?: Database | Transaction,
  ): Promise<TTable['$inferSelect'] | null> {
    const record = this._data.find((item) => item.id === id) ?? null
    return Promise.resolve(record)
  }

  findBy(
    criteria: Partial<TTable['$inferSelect']>[],
    _orderBy?: Partial<Record<keyof TTable['$inferSelect'], 'asc' | 'desc'>>,
    limit?: number,
    _offset?: number,
    _tx?: Database | Transaction,
  ): Promise<TTable['$inferSelect'][]> {
    const records = this._data.filter((item) =>
      criteria.every((criterion) =>
        Object.entries(criterion).every(
          ([key, value]) => item[key as keyof TTable['$inferSelect']] === value,
        ),
      ),
    )

    return Promise.resolve(limit ? records.slice(0, limit) : records)
  }

  count(
    criteria: Partial<TTable['$inferSelect']>[],
    _tx?: Database | Transaction,
  ): Promise<number> {
    const records = this._data.filter((item) =>
      criteria.every((criterion) =>
        Object.entries(criterion).every(
          ([key, value]) => item[key as keyof TTable['$inferSelect']] === value,
        ),
      ),
    )

    return Promise.resolve(records.length)
  }

  create(
    data: TTable['$inferInsert'],
    _tx?: Database | Transaction,
  ): Promise<{ id: TTable['$inferSelect']['id'] } | null> {
    const id = String(BaseRepository._idCounter++)
    this._data.push({ ...data, id })
    return Promise.resolve({ id })
  }

  update(
    id: TTable['$inferSelect']['id'],
    data: Partial<TTable['$inferInsert']>,
    _tx?: Database | Transaction,
  ): Promise<{ id: TTable['$inferSelect']['id'] } | null> {
    const recordIndex = this._data.findIndex((item) => item.id === id)
    if (recordIndex === -1) return Promise.resolve(null)

    this._data[recordIndex] = {
      ...this._data[recordIndex],
      ...data,
    } as TTable['$inferSelect']

    return Promise.resolve({ id })
  }
  delete(
    id: TTable['$inferSelect']['id'],
    _tx?: Database | Transaction,
  ): Promise<{ id: TTable['$inferSelect']['id'] } | null> {
    const recordIndex = this._data.findIndex((item) => item.id === id)
    if (recordIndex === -1) return Promise.resolve(null)

    this._data.splice(recordIndex, 1)
    return Promise.resolve({ id })
  }
}
