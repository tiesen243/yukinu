import type { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export abstract class AbstractRepository<
  TEntity extends AbstractEntity<unknown, TPrimaryKey>,
  TPrimaryKey extends string | number = string,
  TTransaction = unknown,
> {
  public abstract all(
    criterias?: Partial<TEntity>[],
    orderBy?: Partial<Record<keyof TEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: TTransaction,
  ): Promise<TEntity[]>

  public abstract count(
    criterias?: Partial<TEntity>[],
    tx?: TTransaction,
  ): Promise<number>

  public abstract find(
    criteria: Partial<TEntity>,
    tx?: TTransaction,
  ): Promise<TEntity | null>

  public abstract save(entity: TEntity, tx?: TTransaction): Promise<void>

  public abstract delete(
    criteria: Partial<TEntity>,
    tx?: TTransaction,
  ): Promise<void>
}
