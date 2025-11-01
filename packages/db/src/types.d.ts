import type { ExtractTablesWithRelations } from 'drizzle-orm'
import type {
  PgColumn,
  PgTableWithColumns,
  PgTransaction,
} from 'drizzle-orm/pg-core'
import type {
  PostgresJsDatabase,
  PostgresJsQueryResultHKT,
} from 'drizzle-orm/postgres-js'

export type Database = PostgresJsDatabase
export type Transaction = PgTransaction<
  PostgresJsQueryResultHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>

export type Table = PgTableWithColumns<{
  name: string
  schema: undefined
  columns: { id: PgColumn<{ name: 'id'; dataType: string }, unknown, unknown> }
  dialect: 'pg'
}>
