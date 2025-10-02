import { relations } from 'drizzle-orm'
import { index, pgEnum, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { createdAt, createId, updatedAt } from '../utils'
import { products } from './product'
import { users } from './user'

export const vendorRoleEnum = pgEnum('vendor_role', [
  'owner',
  'manager',
  'staff',
])

export const statusEnum = pgEnum('vendor_status', [
  'pending',
  'approved',
  'suspended',
])

export const vendors = pgTable(
  'vendors',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),

    name: t.varchar({ length: 255 }).notNull(),
    description: t.text(),
    logoUrl: t.varchar({ length: 255 }),
    status: statusEnum().default('pending').notNull(),
    createdAt,
    updatedAt,
  }),
  (t) => [
    index('vendors_name_idx').on(t.name),
    index('vendors_status_idx').on(t.status),
  ],
)

export const vendorsRelations = relations(vendors, ({ many }) => ({
  users: many(vendorUsers),
  collections: many(vendorCollections),
  products: many(products),
}))

export const vendorUsers = pgTable(
  'vendor_users',
  (t) => ({
    vendorId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => vendors.id, { onDelete: 'cascade' }),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    role: vendorRoleEnum().default('staff').notNull(),
    createdAt,
  }),
  (t) => [
    primaryKey({ columns: [t.vendorId, t.userId] }),
    index('vendor_users_vendor_id_idx').on(t.vendorId),
    index('vendor_users_user_id_idx').on(t.userId),
    index('vendor_users_role_idx').on(t.role),
  ],
)

export const vendorUsersRelations = relations(vendorUsers, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorUsers.vendorId],
    references: [vendors.id],
  }),
  user: one(users, {
    fields: [vendorUsers.userId],
    references: [users.id],
  }),
}))

export const vendorCollections = pgTable(
  'vendor_collections',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
    vendorId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => vendors.id, { onDelete: 'cascade' }),

    name: t.varchar({ length: 255 }).notNull(),
    description: t.text(),
    createdAt,
    updatedAt,
  }),
  (t) => [
    index('vendor_collections_vendor_id_idx').on(t.vendorId),
    index('vendor_collections_name_idx').on(t.name),
  ],
)

export const vendorCollectionsRelations = relations(
  vendorCollections,
  ({ one, many }) => ({
    vendor: one(vendors, {
      fields: [vendorCollections.vendorId],
      references: [vendors.id],
    }),
    items: many(vendorCollectionItems),
  }),
)

export const vendorCollectionItems = pgTable(
  'vendor_collection_items',
  (t) => ({
    collectionId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => vendorCollections.id, { onDelete: 'cascade' }),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
  }),
  (t) => [
    primaryKey({ columns: [t.collectionId, t.productId] }),
    index('vendor_collection_items_collection_id_idx').on(t.collectionId),
    index('vendor_collection_items_product_id_idx').on(t.productId),
  ],
)

export const vendorCollectionItemsRelations = relations(
  vendorCollectionItems,
  ({ one }) => ({
    collection: one(vendorCollections, {
      fields: [vendorCollectionItems.collectionId],
      references: [vendorCollections.id],
    }),
    product: one(products, {
      fields: [vendorCollectionItems.productId],
      references: [products.id],
    }),
  }),
)
