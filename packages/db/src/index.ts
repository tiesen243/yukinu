import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '@yukinu/validators/env'

import * as order from './schemas/order'
import * as payment from './schemas/payment'
import * as product from './schemas/product'
import * as profile from './schemas/profile'
import * as review from './schemas/review'
import * as user from './schemas/user'
import * as vendor from './schemas/vendor'

const createDrizzleClient = () => {
  const conn = postgres({
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    ssl: env.NODE_ENV === 'production' ? 'require' : false,
  })
  return drizzle(conn, {
    casing: 'snake_case',
    schema: {
      ...order,
      ...payment,
      ...product,
      ...profile,
      ...review,
      ...user,
      ...vendor,
    },
  })
}
const globalForDrizzle = globalThis as unknown as {
  db: ReturnType<typeof createDrizzleClient> | undefined
}
export const db = globalForDrizzle.db ?? createDrizzleClient()
if (process.env.NODE_ENV !== 'production') globalForDrizzle.db = db

export * from 'drizzle-orm'
