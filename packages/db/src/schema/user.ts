import { index, pgEnum, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { createId } from '@yukinu/lib/create-id'
import { UserValidators } from '@yukinu/validators/user'

import { products, users } from '@/schema'

export const ticketStatusEnum = pgEnum(
  'ticket_status',
  UserValidators.ticketStatuses,
)

export const profiles = pgTable('profiles', (t) => ({
  id: t
    .varchar({ length: 24 })
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  fullName: t.varchar({ length: 255 }),
  bio: t.text(),
  gender: t.varchar({ length: 50 }),
  dateOfBirth: t.date(),
}))

export const addresses = pgTable(
  'addresses',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    recipientName: t.varchar({ length: 255 }).notNull(),
    phoneNumber: t.varchar({ length: 20 }).notNull(),
    street: t.varchar({ length: 255 }).notNull(),
    city: t.varchar({ length: 100 }).notNull(),
    state: t.varchar({ length: 100 }).notNull(),
    postalCode: t.varchar({ length: 20 }).notNull(),
    country: t.varchar({ length: 100 }).notNull(),
  }),
  (t) => [index('addresses_user_id_idx').on(t.userId)],
)

export const wishlistItems = pgTable(
  'wishlist_items',
  (t) => ({
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
    primaryKey({ columns: [t.userId, t.productId] }),
    index('wishlist_items_user_id_idx').on(t.userId),
  ],
)

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
