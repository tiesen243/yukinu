import { createId } from '@yukinu/lib/create-id'
import { GeneralValidators } from '@yukinu/validators/general'
import { index, pgEnum, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'

import { users } from '@/schema/auth'
import { products } from '@/schema/product'

export const ticketStatusEnum = pgEnum(
  'ticket_status',
  GeneralValidators.ticketStatuses,
)

export const banners = pgTable('banners', (t) => ({
  id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
  url: t.varchar({ length: 500 }).notNull(),
  createdAt: t.timestamp({ mode: 'date' }).defaultNow().notNull(),
}))

export const vouchers = pgTable(
  'vouchers',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    code: t.varchar({ length: 50 }).notNull().unique(),
    discountAmount: t.numeric({ precision: 10, scale: 2 }),
    discountPercentage: t.integer(),
    expiryDate: t.timestamp().notNull(),
  }),
  (t) => [uniqueIndex('vouchers_code_uq_idx').on(t.code)],
)

export const wishlistItems = pgTable(
  'wishlist_items',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    addedAt: t.timestamp({ mode: 'date' }).defaultNow().notNull(),
  }),
  (t) => [
    uniqueIndex('wishlist_items_user_product_uq_idx').on(t.userId, t.productId),
    index('wishlist_items_user_id_idx').on(t.userId),
  ],
)

export const tickets = pgTable(
  'tickets',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    subject: t.varchar({ length: 255 }).notNull(),
    description: t.text().notNull(),
    status: ticketStatusEnum().default('open').notNull(),
    createdAt: t.timestamp({ mode: 'date' }).defaultNow().notNull(),
  }),
  (t) => [index('tickets_user_id_idx').on(t.userId)],
)
