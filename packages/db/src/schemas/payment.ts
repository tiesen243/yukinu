import { relations } from 'drizzle-orm'
import { pgEnum, pgTable } from 'drizzle-orm/pg-core'

import { createdAt, createId } from '../utils'
import { orders } from './order'

export const paymentMethodEnum = pgEnum('payment_method', [
  'cod',
  'credit_card',
  'paypal',
  'bank_transfer',
])

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'success',
  'failed',
  'refunded',
])

export const payments = pgTable('payments', (t) => ({
  id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
  orderId: t
    .varchar({ length: 24 })
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  transactionId: t.varchar({ length: 100 }),

  amount: t.numeric({ precision: 10, scale: 2 }).notNull(),
  method: paymentMethodEnum().notNull(),
  status: paymentStatusEnum().default('pending').notNull(),
  createdAt,
}))

export const paymentRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}))

export const shippingStatusEnum = pgEnum('shipping_status', [
  'pending',
  'shipped',
  'in_transit',
  'delivered',
  'failed',
])

export const shippings = pgTable('shippings', (t) => ({
  id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
  orderId: t
    .varchar({ length: 24 })
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),

  carrier: t.varchar({ length: 100 }).notNull(),
  trackingNumber: t.varchar({ length: 100 }).notNull(),
  status: shippingStatusEnum().default('pending').notNull(),
  shippedAt: t.timestamp(),
  deliveredAt: t.timestamp(),
}))

export const shippingRelations = relations(shippings, ({ one }) => ({
  order: one(orders, {
    fields: [shippings.orderId],
    references: [orders.id],
  }),
}))
