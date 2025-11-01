import { pgEnum, pgTable } from 'drizzle-orm/pg-core'

import { createdAt, createId, updatedAt } from '../utils'

export const ticketStatusEnum = pgEnum('ticket_status', [
  'open',
  'resolved',
  'closed',
])

export const ticketPriorityEnum = pgEnum('ticket_priority', [
  'low',
  'medium',
  'high',
  'urgent',
])

export const tickets = pgTable('tickets', (t) => ({
  id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
  title: t.varchar({ length: 255 }).notNull(),
  description: t.text().notNull(),
  status: ticketStatusEnum().default('open').notNull(),
  priority: ticketPriorityEnum().default('medium').notNull(),
  createdAt,
  updatedAt,
}))
export type Ticket = typeof tickets.$inferSelect
export type NewTicket = typeof tickets.$inferInsert
