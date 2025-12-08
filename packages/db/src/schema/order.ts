import { index, pgEnum, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { createId } from '@yukinu/lib/create-id'

import { products, users } from '@/schema'
import { createdAt, updatedAt } from '@/schema/shared'

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
])

export const paymentMethodEnum = pgEnum('payment_method', [
  'bank_transfer',
  'cash_on_delivery',
])

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
])

export const orders = pgTable(
  'orders',
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'set null' }),
    voucherId: t
      .varchar({ length: 24 })
      .references(() => vouchers.id, { onDelete: 'set null' }),
    totalAmount: t.numeric({ precision: 10, scale: 2 }).notNull(),
    status: orderStatusEnum().default('pending').notNull(),
    createdAt,
    updatedAt,
  }),
  (t) => [index('orders_user_id_idx').on(t.userId)],
)

export const orderItems = pgTable(
  'order_items',
  (t) => ({
    orderId: t
      .integer()
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: t
      .varchar({ length: 24 })
      .references(() => products.id, { onDelete: 'set null' }),
    quantity: t.integer().notNull(),
    unitPrice: t.numeric({ precision: 10, scale: 2 }).notNull(),
  }),
  (t) => [
    primaryKey({ columns: [t.orderId, t.productId] }),
    index('order_items_order_id_idx').on(t.orderId),
  ],
)

export const transactions = pgTable(
  'transactions',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    orderId: t
      .integer()
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    amount: t.numeric({ precision: 10, scale: 2 }).notNull(),
    method: paymentMethodEnum().notNull(),
    status: paymentStatusEnum().default('pending').notNull(),
    createdAt,
    updatedAt,
  }),
  (t) => [index('transactions_order_id_idx').on(t.orderId)],
)

export const vouchers = pgTable('vouchers', (t) => ({
  id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
  code: t.varchar({ length: 50 }).notNull().unique(),
  discountAmount: t.numeric({ precision: 10, scale: 2 }),
  discountPercentage: t.integer(),
  expiryDate: t.timestamp().notNull(),
}))
