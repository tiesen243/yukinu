import { relations } from 'drizzle-orm'
import { index, pgEnum, pgTable } from 'drizzle-orm/pg-core'

import { createdAt, createId, updatedAt } from '../utils'
import { products, productVariants } from './product'
import { addresses } from './profile'
import { users } from './user'

export const orderStatusEnum = pgEnum('order_status', [
  'new',
  'pending',
  'paid',
  'shipped',
  'completed',
  'cancelled',
  'refunded',
])

export const orders = pgTable(
  'orders',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
    userId: t
      .varchar({ length: 24 })
      .references(() => users.id, { onDelete: 'set null' }),
    shippingAddressId: t
      .varchar({ length: 24 })
      .references(() => addresses.id, { onDelete: 'set null' }),

    status: orderStatusEnum().default('pending').notNull(),
    totalAmount: t.numeric({ precision: 12, scale: 2 }).notNull(),
    createdAt,
    updatedAt,
  }),
  (t) => [
    index('orders_user_id_idx').on(t.userId),
    index('orders_status_idx').on(t.status),
  ],
)

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
  }),

  items: many(orderItems),
}))

export const orderItems = pgTable('order_items', (t) => ({
  id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
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
    .notNull()
    .references(() => productVariants.id, { onDelete: 'restrict' }),

  quantity: t.integer().default(1).notNull(),
  price: t.numeric({ precision: 12, scale: 2 }).notNull(),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}))
