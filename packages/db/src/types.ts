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
    id: PgColumn<
      {
        name: 'id'
        tableName: string
        dataType: 'string'
        columnType: 'PgVarchar'
        data: string
        driverParam: string
        notNull: boolean
        hasDefault: boolean
        isPrimaryKey: boolean
        isAutoincrement: boolean
        hasRuntimeDefault: boolean
        enumValues: [string, ...string[]]
        generated: undefined
      },
      object,
      object
    >
  }
  dialect: 'pg'
}>
