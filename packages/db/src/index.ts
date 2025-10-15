import type { ExtractTablesWithRelations } from 'drizzle-orm'
import type {
  AnyPgColumn,
  PgTableWithColumns,
  PgTransaction,
} from 'drizzle-orm/pg-core'
import type {
  PostgresJsDatabase,
  PostgresJsQueryResultHKT,
} from 'drizzle-orm/postgres-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '@yukinu/validators/env'

const createDrizzleClient = () => {
  const conn = postgres({
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DATABASE,
    ssl: env.NODE_ENV === 'production' ? 'require' : false,
  })
  return drizzle(conn, { casing: 'snake_case' })
}
const globalForDrizzle = globalThis as unknown as {
  db: ReturnType<typeof createDrizzleClient> | undefined
}
export const db = globalForDrizzle.db ?? createDrizzleClient()
if (env.NODE_ENV !== 'production') globalForDrizzle.db = db

type Database = PostgresJsDatabase

type Table = PgTableWithColumns<{
  name: string
  schema: undefined
  dialect: 'pg'
  columns: { id: AnyPgColumn<{ data: string }> }
}>

type Transaction = PgTransaction<
  PostgresJsQueryResultHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>

export type { Database, Table, Transaction }
export * from 'drizzle-orm'
