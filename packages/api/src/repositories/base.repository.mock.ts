import type { Database, Table, Transaction } from '@yukinu/db'

import type { IBaseRepository } from './base'

export abstract class BaseRepositoryMock<TTable extends Table>
  implements IBaseRepository<TTable>
{
  constructor(
    protected readonly _db: Database,
    protected readonly _table: TTable,
  ) {}

  async findAll(
    _tx?: Database | Transaction,
  ): Promise<TTable['$inferSelect'][]> {
    return Promise.resolve([])
  }

  async findById(
    id: string,
    _tx: Database | Transaction,
  ): Promise<TTable['$inferSelect'] | null> {
    if (id === 'find-fail') return Promise.resolve(null)
    return Promise.resolve({ id } as TTable['$inferSelect'])
  }

  async create(
    data: TTable['$inferInsert'],
    _tx: Database | Transaction,
  ): Promise<{ id: TTable['$inferSelect']['id'] } | null> {
    // @ts-expect-error - just for testing purposes
    if (data.id === 'create-fail') return Promise.resolve(null)
    return Promise.resolve({ id: 'mock-id' })
  }

  async update(
    id: string,
    _data: Partial<TTable['$inferInsert']>,
    _tx: Database | Transaction,
  ): Promise<{ id: TTable['$inferSelect']['id'] } | null> {
    if (id === 'update-fail') return Promise.resolve(null)
    return Promise.resolve({ id })
  }

  async delete(
    id: string,
    _tx: Database | Transaction,
  ): Promise<{ id: TTable['$inferSelect']['id'] } | null> {
    if (id === 'delete-fail') return Promise.resolve(null)
    return Promise.resolve({ id })
  }
}
