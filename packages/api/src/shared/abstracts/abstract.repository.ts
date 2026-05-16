import type { AbstractEntity } from '@/shared/abstracts/abstract.entity'

export abstract class AbstractRepository<
  TEntity extends AbstractEntity<unknown, TPrimaryKey>,
  TPrimaryKey extends string | number = string,
  TTransaction = unknown,
> {
  public abstract find(
    criterias?: AbstractRepository.Criteria<TEntity>[],
    orderBy?: Partial<Record<keyof TEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: TTransaction,
  ): Promise<TEntity[]>

  public abstract count(
    criterias?: AbstractRepository.Criteria<TEntity>[],
    tx?: TTransaction,
  ): Promise<number>

  public abstract save(entity: TEntity, tx?: TTransaction): Promise<TPrimaryKey>

  public abstract saveMany(
    entities: TEntity[],
    tx?: TTransaction,
  ): Promise<void>

  public abstract delete(
    criterias: AbstractRepository.Criteria<TEntity>[],
    tx?: TTransaction,
  ): Promise<void>
}

export namespace AbstractRepository {
  interface StringOps {
    $like?: string
    $nlike?: string
    $startsWith?: string
    $endsWith?: string
  }

  interface NumberOps {
    $gt?: number
    $gte?: number
    $lt?: number
    $lte?: number
  }

  export type OperatorObject<TEntity> = {
    [K in keyof TEntity]?: TEntity[K] extends string
      ? StringOps
      : never | TEntity[K] extends number
        ? NumberOps
        : never
  }

  export type Criteria<TEntity> = {
    [K in keyof TEntity]?:
      | TEntity[K]
      | TEntity[K][]
      | 'not null'
      | 'null'
      | (TEntity[K] extends string ? StringOps : never)
      | (TEntity[K] extends number ? NumberOps : never)
  }
}
