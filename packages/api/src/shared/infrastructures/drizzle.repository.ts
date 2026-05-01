import type { Database, PgTable, SQL, SQLWrapper } from '@yukinu/db/drizzle'

import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lt,
  lte,
  ne,
  notLike,
  or,
} from '@yukinu/db/drizzle'

import type { AbstractEntity } from '@/shared/abstracts/abstract.entity'

import { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export abstract class DrizzleRepository<
  TEntity extends AbstractEntity<unknown, TPrimaryKey>,
  TTable extends PgTable,
  TPrimaryKey extends string | number = string,
> extends AbstractRepository<TEntity, TPrimaryKey, Database> {
  public constructor(
    protected readonly _db: Database,
    protected readonly _table: TTable,
    protected readonly _primaryKey:
      | keyof TTable
      | (keyof TTable)[] = 'id' as keyof TTable,
  ) {
    super()
  }

  public override async find(
    criterias: AbstractRepository.Criteria<TEntity>[] = [],
    orderBy: Partial<Record<keyof TEntity, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx: Database = this._db,
  ): Promise<TEntity[]> {
    const whereClauses = this._buildCriteria(criterias)
    const orderByClause = this._buildOrderBy(orderBy)

    const query = tx
      .select()
      .from(this._table as never)
      .$dynamic()

    if (whereClauses) query.where(whereClauses)
    if (orderByClause) query.orderBy(orderByClause)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    const rows = await query

    return rows.map((row) => this._mapToEntity(row))
  }

  public override count(
    criterias: AbstractRepository.Criteria<TEntity>[] = [],
    tx: Database = this._db,
  ): Promise<number> {
    const whereClause = this._buildCriteria(criterias)
    return tx.$count(this._table, whereClause)
  }

  public override async save(
    entity: TEntity,
    tx: Database = this._db,
  ): Promise<void> {
    const row = this._mapToRow(entity)

    await tx
      .insert(this._table)
      .values(row)
      .onConflictDoUpdate({
        target: Array.isArray(this._primaryKey)
          ? this._primaryKey.map((key) => this._table[key] as never)
          : (this._table[this._primaryKey] as never),
        set: row,
      })
  }

  public override async saveMany(
    entities: TEntity[],
    tx: Database = this._db,
  ): Promise<void> {
    if (entities.length === 0) return
    const rows = entities.map((entity) => this._mapToRow(entity))

    await tx
      .insert(this._table)
      .values(rows)
      .onConflictDoUpdate({
        target: Array.isArray(this._primaryKey)
          ? this._primaryKey.map((key) => this._table[key] as never)
          : (this._table[this._primaryKey] as never),
        set: rows[0] as never,
      })
  }

  public override async delete(
    criterias: AbstractRepository.Criteria<TEntity>[],
    tx: Database = this._db,
  ): Promise<void> {
    const whereClause = this._buildCriteria(criterias)
    if (!whereClause) return

    await tx.delete(this._table).where(whereClause)
  }

  protected abstract _mapToEntity(
    row: DrizzleRepository.ExtractType<TTable>,
  ): TEntity
  protected _mapToRow(entity: TEntity): DrizzleRepository.ExtractType<TTable> {
    return entity.toJSON() as DrizzleRepository.ExtractType<TTable>
  }

  protected _buildCriteria(
    criterias: AbstractRepository.Criteria<TEntity>[],
  ): SQL | undefined {
    if (criterias.length === 0) return undefined

    const expressions = criterias.map((criteria) => {
      const fields = Object.entries(criteria).map(([field, value]) =>
        this._parseCondition(field as keyof TTable, value),
      )
      return and(...fields)
    })

    return expressions.length === 1 ? expressions[0] : or(...expressions)
  }

  private _parseCondition<V>(field: keyof TTable, value: V): SQL {
    const column = this._table[field] as unknown as SQLWrapper

    if (Array.isArray(value)) return inArray(column, value)

    if (typeof value === 'string') {
      if (value.startsWith('!')) return ne(column, value.slice(1))
      if (value === 'not null') return isNotNull(column)
      if (value === 'null') return isNull(column)
    }

    if (typeof value === 'object' && value !== null) {
      const conditions: SQL[] = []
      const _value = value as AbstractRepository.OperatorObject<TEntity>

      if ('$gt' in _value) conditions.push(gt(column, _value.$gt))
      if ('$gte' in _value) conditions.push(gte(column, _value.$gte))
      if ('$lt' in _value) conditions.push(lt(column, _value.$lt))
      if ('$lte' in _value) conditions.push(lte(column, _value.$lte))

      if ('$like' in _value)
        conditions.push(ilike(column as never, `%${_value.$like}%`))
      if ('$nlike' in _value)
        conditions.push(notLike(column as never, `%${_value.$nlike}%`))
      if ('$startsWith' in _value)
        conditions.push(ilike(column as never, `${_value.$startsWith}%`))
      if ('$endsWith' in _value)
        conditions.push(ilike(column as never, `%${_value.$endsWith}`))

      return and(...conditions) ?? eq(column, value)
    }

    return eq(this._table[field] as never, value)
  }

  protected _buildOrderBy(
    orderBy: Partial<Record<keyof TEntity, 'asc' | 'desc'>>,
  ): SQL | undefined {
    if (Object.keys(orderBy).length === 0) return undefined

    const conditions = Object.entries(orderBy).map(([field, direction]) =>
      direction === 'asc'
        ? asc(this._table[field as keyof TTable] as never)
        : desc(this._table[field as keyof TTable] as never),
    )

    return conditions.length === 1 ? conditions[0] : and(...conditions)
  }
}

export namespace DrizzleRepository {
  export type ExtractType<TTable extends PgTable> = {
    [K in keyof TTable['$inferSelect']]: TTable['$inferSelect'][K]
  }
}
