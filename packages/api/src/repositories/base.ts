import type { Database, Table, Transaction } from '@yukinu/db'

export interface IBaseRepository<TTable extends Table> {
  findAll(tx: Database | Transaction): Promise<TTable['$inferSelect'][]>

  findById(
    id: string,
    tx: Database | Transaction,
  ): Promise<TTable['$inferSelect'] | null>

  create(
    data: Partial<TTable['$inferInsert']>,
    tx: Database | Transaction,
  ): Promise<{ id: string } | null>

  update(
    id: string,
    data: Partial<TTable['$inferInsert']>,
    tx: Database | Transaction,
  ): Promise<{ id: string } | null>

  delete(id: string, tx: Database | Transaction): Promise<{ id: string } | null>
}
