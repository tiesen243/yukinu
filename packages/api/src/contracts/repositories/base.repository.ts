import type { Database, PgTable } from '@yukinu/db'

export interface IBaseRepository<T extends PgTable> {
  all(
    criterias?: Partial<T['$inferSelect']>[],
    orderBy?: Partial<Record<keyof T['$inferSelect'], 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: Database,
  ): Promise<T['$inferSelect'][]>

  find(
    id: T['$inferSelect']['id'],
    tx?: Database,
  ): Promise<T['$inferSelect'] | null>

  count(
    criterias?: Partial<T['$inferSelect']>[],
    tx?: Database,
  ): Promise<number>

  create(
    data: T['$inferInsert'],
    tx?: Database,
  ): Promise<T['$inferSelect']['id']>

  createMany(
    data: T['$inferInsert'][],
    tx?: Database,
  ): Promise<T['$inferSelect']['id'][]>

  update(
    id: T['$inferSelect']['id'],
    data: Partial<T['$inferSelect']>,
    tx?: Database,
  ): Promise<T['$inferSelect']['id']>

  updateMany(
    criterias: Partial<T['$inferSelect']>[],
    data: Partial<T['$inferSelect']>,
    tx?: Database,
  ): Promise<T['$inferSelect']['id'][]>

  delete(
    id: T['$inferSelect']['id'],
    tx?: Database,
  ): Promise<T['$inferSelect']['id']>

  deleteMany(
    criterias: Partial<T['$inferSelect']>[],
    tx?: Database,
  ): Promise<T['$inferSelect']['id'][]>
}
