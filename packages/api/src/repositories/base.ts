import type { Database, Table, Transaction } from '@yukinu/db'

export interface IBaseRepository<TTable extends Table> {
  findAll(tx?: Database | Transaction): Promise<TTable['$inferSelect'][]>

  findById(
    id: Table['$inferSelect']['id'],
    tx?: Database | Transaction,
  ): Promise<TTable['$inferSelect'] | null>

  create(
    data: TTable['$inferInsert'],
    tx?: Database | Transaction,
  ): Promise<{ id: TTable['$inferSelect']['id'] } | null>

  update(
    id: Table['$inferSelect']['id'],
    data: Partial<TTable['$inferInsert']>,
    tx?: Database | Transaction,
  ): Promise<{ id: Table['$inferSelect']['id'] } | null>

  delete(
    id: Table['$inferSelect']['id'],
    tx?: Database | Transaction,
  ): Promise<{ id: Table['$inferSelect']['id'] } | null>
}
