import { jest } from 'bun:test'
import { drizzle } from 'drizzle-orm/postgres-js'

const db = drizzle.mock()
db.transaction = jest
  .fn()
  .mockImplementation(async (cb: (_db: typeof db) => unknown) =>
    Promise.resolve(cb(db)),
  )

export { db }
