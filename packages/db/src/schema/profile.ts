import { relations } from 'drizzle-orm'
import { index, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { products } from '@/schema/product'
import { users } from '@/schema/user'
import { createId } from '@/utils'

export const profiles = pgTable(
  'profiles',
  (t) => ({
    id: t
      .varchar({ length: 24 })
      .primaryKey()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    fullName: t.varchar({ length: 255 }),
    avatarUrl: t.text(),
    bio: t.text(),
    gender: t.varchar({ length: 50 }),
    dateOfBirth: t.date(),
    website: t.varchar({ length: 255 }),
  }),
  (t) => [index('profiles_full_name_idx').on(t.fullName)],
)

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.id], references: [users.id] }),
}))

export const addresses = pgTable(
  'addresses',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
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
    isDefault: t.boolean().default(false).notNull(),
  }),
  (t) => [
    index('addresses_user_id_idx').on(t.userId),
    index('addresses_is_default_idx').on(t.isDefault),
  ],
)

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
}))

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
    addedAt: t.timestamp({ mode: 'date', withTimezone: true }).defaultNow(),
  }),
  (t) => [
    primaryKey({ columns: [t.userId, t.productId] }),
    index('wishlist_user_id_idx').on(t.userId),
  ],
)

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, { fields: [wishlistItems.userId], references: [users.id] }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
}))
