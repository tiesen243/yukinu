import type {
  ColumnBaseConfig,
  ColumnDataType,
  ExtractTablesWithRelations,
} from 'drizzle-orm'
import type {
  PgColumn,
  PgTableWithColumns,
  PgTransaction,
} from 'drizzle-orm/pg-core'
import type {
  PostgresJsDatabase,
  PostgresJsQueryResultHKT,
} from 'drizzle-orm/postgres-js'

export type Database =
  | PostgresJsDatabase
  | PgTransaction<
      PostgresJsQueryResultHKT,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >

export type PgTable = PgTableWithColumns<{
  name: string
  schema: undefined
  columns: {
    id: PgColumn<ColumnBaseConfig<ColumnDataType, string>, object, object>
  }
  dialect: 'pg'
}>
