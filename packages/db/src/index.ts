import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const createDrizzleClient = () => {
  const conn = postgres(
    process.env.DATABASE_URL ??
      'postgresql://yukinu:supersecret@127.0.0.1:5432/db',
  )
  return drizzle(conn, { casing: 'snake_case' })
}
const globalForDrizzle = globalThis as unknown as {
  db: ReturnType<typeof createDrizzleClient> | undefined
}
export const db = globalForDrizzle.db ?? createDrizzleClient()
if (process.env.NODE_ENV !== 'production') globalForDrizzle.db = db
