import type { Database, PgTable } from '@yukinu/db'

export interface IBaseRepository<T extends PgTable> {
  all(tx?: Database): Promise<T['$inferSelect'][]>

  find(
    id: T['$inferSelect']['id'],
    tx?: Database,
  ): Promise<T['$inferSelect'] | null>

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
    ids: T['$inferSelect']['id'][],
    data: Partial<T['$inferSelect']>,
    tx?: Database,
  ): Promise<T['$inferSelect']['id'][]>

  delete(
    id: T['$inferSelect']['id'],
    tx?: Database,
  ): Promise<T['$inferSelect']['id']>

  deleteMany(
    ids: T['$inferSelect']['id'][],
    tx?: Database,
  ): Promise<T['$inferSelect']['id'][]>
}
