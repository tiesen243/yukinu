import { timestamp } from 'drizzle-orm/pg-core'

export const createdAt = timestamp().defaultNow().notNull()
export const updatedAt = timestamp()
  .defaultNow()
  .notNull()
  .$onUpdate(() => new Date())
