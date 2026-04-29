import type { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export abstract class AbstractRepository<
  TEntity extends AbstractEntity<unknown, TPrimaryKey>,
  TPrimaryKey extends string | number = string,
> {
  public abstract all(
    criterias?: Partial<TEntity>[],
    orderBy?: Partial<Record<keyof TEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
  ): Promise<TEntity[]>

  public abstract count(criterias?: Partial<TEntity>[]): Promise<number>

  public abstract find(criteria: Partial<TEntity>): Promise<TEntity | null>

  public abstract save(entity: TEntity): Promise<void>

  public abstract delete(criteria: Partial<TEntity>): Promise<void>
}
