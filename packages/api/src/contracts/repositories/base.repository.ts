import type { Database, Table, Transaction } from '@yukinu/db/types'

export interface IBaseRepository<TTable extends Table> {
  all(tx?: Database | Transaction): Promise<TTable['$inferSelect'][]>

  find(
    id: TTable['$inferSelect']['id'],
    tx?: Database | Transaction,
  ): Promise<TTable['$inferSelect'] | null>

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
