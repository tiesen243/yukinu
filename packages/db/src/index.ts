// oxlint-disable no-process-env

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const createDrizzleClient = () => {
  const conn = postgres({
    host: process.env.POSTGRES_HOST ?? '',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    user: process.env.POSTGRES_USER ?? '',
    password: process.env.POSTGRES_PASSWORD ?? '',
    database: process.env.POSTGRES_DATABASE ?? '',
    ssl: process.env.POSTGRES_SSL_MODE === 'true' ? 'require' : false,
  })
  return drizzle(conn, { casing: 'snake_case' })
}
const globalForDrizzle = globalThis as unknown as {
  db: ReturnType<typeof createDrizzleClient> | undefined
}
export const db = globalForDrizzle.db ?? createDrizzleClient()
if (process.env.NODE_ENV !== 'production') globalForDrizzle.db = db

export type * from '@/types'
export * as orm from 'drizzle-orm'
export { alias } from 'drizzle-orm/pg-core'
