import { relations } from 'drizzle-orm'
import { index, pgEnum, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { products } from '@/schema/product'
import { users } from '@/schema/user'
import { createdAt, createId, updatedAt } from '@/utils'

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
    website: t.varchar({ length: 255 }),
    status: statusEnum().default('pending').notNull(),
    createdAt,
    updatedAt,
  }),
  (t) => [
    index('vendors_name_idx').on(t.name),
    index('vendors_status_idx').on(t.status),
  ],
)
export type Vendor = typeof vendors.$inferSelect
export type NewVendor = typeof vendors.$inferInsert

export const vendorsRelations = relations(vendors, ({ many }) => ({
  members: many(vendorMembers),
  collections: many(vendorCollections),
  products: many(products),
}))

export const vendorMembers = pgTable(
  'vendor_members',
  (t) => ({
    vendorId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => vendors.id, { onDelete: 'cascade' }),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    joinedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
  }),
  (t) => [
    primaryKey({ columns: [t.vendorId, t.userId] }),
    index('vendor_members_user_id_idx').on(t.userId),
  ],
)
export type VendorMember = typeof vendorMembers.$inferSelect
export type NewVendorMember = typeof vendorMembers.$inferInsert

export const vendorMembersRelations = relations(vendorMembers, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorMembers.vendorId],
    references: [vendors.id],
  }),
  user: one(users, { fields: [vendorMembers.userId], references: [users.id] }),
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
export type VendorCollection = typeof vendorCollections.$inferSelect
export type NewVendorCollection = typeof vendorCollections.$inferInsert

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
    index('vendor_collection_items_product_id_idx').on(t.productId),
  ],
)
export type VendorCollectionItem = typeof vendorCollectionItems.$inferSelect
export type NewVendorCollectionItem = typeof vendorCollectionItems.$inferInsert

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
