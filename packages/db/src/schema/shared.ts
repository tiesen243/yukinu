import { timestamp } from 'drizzle-orm/pg-core'

export const createdAt = timestamp({ mode: 'date' }).defaultNow().notNull()
export const updatedAt = timestamp({ mode: 'date' })
  .defaultNow()
  .notNull()
  .$onUpdate(() => new Date())
