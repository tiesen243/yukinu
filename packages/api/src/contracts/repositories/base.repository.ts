import type { Database, PgTable } from '@yukinu/db'

export interface IBaseRepository<TTable extends PgTable> {
  findAll(tx?: Database): Promise<TTable['$inferSelect'][]>

  find(
    id: TTable['$inferSelect']['id'],
    tx?: Database,
  ): Promise<TTable['$inferSelect'] | null>

  findBy(
    criteria: Partial<TTable['$inferSelect']>[],
    orderBy?: Partial<Record<keyof TTable['$inferSelect'], 'asc' | 'desc'>>,
    limit?: number,
    offset?: number,
    tx?: Database,
  ): Promise<TTable['$inferSelect'][]>

  count(
    criteria: Partial<TTable['$inferSelect']>[],
    tx?: Database,
  ): Promise<number>

  create(
    data: TTable['$inferInsert'],
    tx?: Database,
  ): Promise<{ id: TTable['$inferSelect']['id'] }>

  update(
    id: TTable['$inferSelect']['id'],
    data: Partial<TTable['$inferInsert']>,
    tx?: Database,
  ): Promise<{ id: TTable['$inferSelect']['id'] }>

  delete(
    id: TTable['$inferSelect']['id'],
    tx?: Database,
  ): Promise<{ id: TTable['$inferSelect']['id'] }>
}
