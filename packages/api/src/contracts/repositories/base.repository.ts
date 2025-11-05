import type { Database, PgTable, Transaction } from '@yukinu/db'

export interface IBaseRepository<TTable extends PgTable> {
  findAll(tx?: Database | Transaction): Promise<TTable['$inferSelect'][]>

  find(
    id: TTable['$inferSelect']['id'],
    tx?: Database | Transaction,
  ): Promise<TTable['$inferSelect'] | null>

  findBy(
    criteria: Partial<TTable['$inferSelect']>[],
    orderBy?: Partial<Record<keyof TTable['$inferSelect'], 'asc' | 'desc'>>,
    limit?: number,
    offset?: number,
    tx?: Database | Transaction,
  ): Promise<TTable['$inferSelect'][]>

  count(
    criteria: Partial<TTable['$inferSelect']>[],
    tx?: Database | Transaction,
  ): Promise<number>

  create(
    data: TTable['$inferInsert'],
    tx?: Database | Transaction,
  ): Promise<{ id: TTable['$inferSelect']['id'] } | null>

  update(
    id: TTable['$inferSelect']['id'],
    data: Partial<TTable['$inferInsert']>,
    tx?: Database | Transaction,
  ): Promise<{ id: TTable['$inferSelect']['id'] } | null>

  delete(
    id: TTable['$inferSelect']['id'],
    tx?: Database | Transaction,
  ): Promise<{ id: TTable['$inferSelect']['id'] } | null>
}
