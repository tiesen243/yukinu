import { relations } from 'drizzle-orm'
import { pgEnum, pgTable } from 'drizzle-orm/pg-core'

import { orders } from '@/schema/order'
import { createdAt, createId } from '@/utils'

export const paymentMethodEnum = pgEnum('payment_method', [
  'credit_card',
  'bank_transfer',
  'cash_on_delivery',
])

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
])

export const payments = pgTable('payments', (t) => ({
  id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
  orderId: t
    .varchar({ length: 24 })
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  amount: t.numeric({ precision: 10, scale: 2 }).notNull(),
  method: paymentMethodEnum().notNull(),
  status: paymentStatusEnum().default('pending').notNull(),
  transactionId: t.varchar({ length: 255 }).unique().notNull(),
  createdAt,
}))

export const paymentsRelation = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}))
