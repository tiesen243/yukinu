import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '@yukinu/validators/env'

const createDrizzleClient = () => {
  const conn = postgres({
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DATABASE,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    ssl: env.NODE_ENV === 'production' ? 'require' : false,
  })
  return drizzle(conn, { casing: 'snake_case' })
}
const globalForDrizzle = globalThis as unknown as {
  db: ReturnType<typeof createDrizzleClient> | undefined
}
export const db = globalForDrizzle.db ?? createDrizzleClient()
if (process.env.NODE_ENV !== 'production') globalForDrizzle.db = db

export * from 'drizzle-orm'
