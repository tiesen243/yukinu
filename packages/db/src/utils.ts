import { timestamp } from 'drizzle-orm/pg-core'

const createdAt = timestamp({ mode: 'date', withTimezone: true })
  .defaultNow()
  .notNull()
const updatedAt = timestamp({ mode: 'date', withTimezone: true })
  .defaultNow()
  .$onUpdateFn(() => new Date())
  .notNull()

export { createId } from '@yukinu/lib/create-id'
export { createdAt, updatedAt }
