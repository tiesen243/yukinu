import type { Database, PgTable } from '@yukinu/db'

import type { IBaseRepository } from '@/types'

export abstract class BaseRepository<
  TTable extends PgTable,
> implements IBaseRepository<TTable> {
  protected _data: TTable['$inferSelect'][] = []
  protected static _idCounter = 1

  findAll(_tx?: Database): Promise<TTable['$inferSelect'][]> {
    return Promise.resolve(this._data)
  }

  find(
    id: TTable['$inferSelect']['id'],
    _tx?: Database,
  ): Promise<TTable['$inferSelect'] | null> {
    const record = this._data.find((item) => item.id === id) ?? null
    return Promise.resolve(record)
  }

  findBy(
    criteria: Partial<TTable['$inferSelect']>[],
    _orderBy?: Partial<Record<keyof TTable['$inferSelect'], 'asc' | 'desc'>>,
    limit?: number,
    _offset?: number,
    _tx?: Database,
  ): Promise<TTable['$inferSelect'][]> {
    const records =
      criteria.length > 0
        ? this._data.filter((item) =>
            criteria.some((criterion) =>
              Object.entries(criterion).every(
                ([key, value]) =>
                  item[key as keyof TTable['$inferSelect']] === value,
              ),
            ),
          )
        : this._data

    return Promise.resolve(limit ? records.slice(0, limit) : records)
  }

  count(
    criteria: Partial<TTable['$inferSelect']>[],
    _tx?: Database,
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
    _tx?: Database,
  ): Promise<{ id: TTable['$inferSelect']['id'] }> {
    const id = String(BaseRepository._idCounter++)
    this._data.push({ ...data, id })
    return Promise.resolve({ id })
  }

  update(
    id: TTable['$inferSelect']['id'],
    data: Partial<TTable['$inferInsert']>,
    _tx?: Database,
  ): Promise<{ id: TTable['$inferSelect']['id'] }> {
    const recordIndex = this._data.findIndex((item) => item.id === id)
    if (recordIndex === -1) throw new Error('Record not found')

    this._data[recordIndex] = {
      ...this._data[recordIndex],
      ...data,
    } as TTable['$inferSelect']

    return Promise.resolve({ id })
  }

  updateBy(
    criteria: Partial<TTable['$inferSelect']>[],
    data: Partial<TTable['$inferInsert']>,
    _tx?: Database,
  ): Promise<number> {
    const recordsToUpdate = this._data.filter((item) =>
      criteria.some((criterion) =>
        Object.entries(criterion).every(
          ([key, value]) => item[key as keyof TTable['$inferSelect']] === value,
        ),
      ),
    )

    recordsToUpdate.forEach((record) => {
      const recordIndex = this._data.findIndex((item) => item.id === record.id)
      this._data[recordIndex] = {
        ...this._data[recordIndex],
        ...data,
      } as TTable['$inferSelect']
    })

    return Promise.resolve(recordsToUpdate.length)
  }

  delete(
    id: TTable['$inferSelect']['id'],
    _tx?: Database,
  ): Promise<{ id: TTable['$inferSelect']['id'] }> {
    const recordIndex = this._data.findIndex((item) => item.id === id)
    if (recordIndex === -1) throw new Error('Record not found')

    this._data.splice(recordIndex, 1)
    return Promise.resolve({ id })
  }

  deleteBy(
    criteria: Partial<TTable['$inferSelect']>[],
    _tx?: Database,
  ): Promise<number> {
    const recordsToDelete = this._data.filter((item) =>
      criteria.some((criterion) =>
        Object.entries(criterion).every(
          ([key, value]) => item[key as keyof TTable['$inferSelect']] === value,
        ),
      ),
    )

    recordsToDelete.forEach((record) => {
      const recordIndex = this._data.findIndex((item) => item.id === record.id)
      this._data.splice(recordIndex, 1)
    })

    return Promise.resolve(recordsToDelete.length)
  }
}
