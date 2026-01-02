import { createId } from '@yukinu/lib/create-id'
import { GeneralValidators } from '@yukinu/validators/general'
import { pgEnum, pgTable } from 'drizzle-orm/pg-core'

import { users } from '@/schema/auth'

export const ticketStatusEnum = pgEnum(
  'ticket_status',
  GeneralValidators.ticketStatuses,
)

export const banners = pgTable('banners', (t) => ({
  id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
  url: t.varchar({ length: 500 }).notNull(),
}))

export const tickets = pgTable('tickets', (t) => ({
  id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
  userId: t
    .varchar({ length: 24 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subject: t.varchar({ length: 255 }).notNull(),
  description: t.text().notNull(),
  status: ticketStatusEnum().default('open').notNull(),
  createdAt: t.timestamp({ mode: 'date' }).defaultNow().notNull(),
}))
