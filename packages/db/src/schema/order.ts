import { relations } from 'drizzle-orm'
import { index, pgEnum, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { createdAt, createId, updatedAt } from '../utils'
import { payments } from './payment'
import { products, productVariants } from './product'
import { users } from './user'

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
])

export const orders = pgTable(
  'orders',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    totalAmount: t.numeric({ precision: 10, scale: 2 }).notNull(),
    status: orderStatusEnum().default('pending').notNull(),
    createdAt,
    updatedAt,
  }),
  (t) => [
    index('orders_user_id_idx').on(t.userId),
    index('orders_status_idx').on(t.status),
  ],
)

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  payment: one(payments),
  items: many(orderItems),
}))

export const orderItems = pgTable(
  'order_items',
  (t) => ({
    orderId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'restrict' }),
    variantId: t
      .varchar({ length: 24 })
      .references(() => productVariants.id, { onDelete: 'restrict' }),
    quantity: t.integer().default(1).notNull(),
    price: t.numeric({ precision: 10, scale: 2 }).notNull(),
  }),
  (t) => [
    primaryKey({ columns: [t.orderId, t.productId, t.variantId] }),
    index('order_items_order_id_idx').on(t.orderId),
  ],
)

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}))
