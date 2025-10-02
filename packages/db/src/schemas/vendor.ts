import { relations } from 'drizzle-orm'
import { index, pgEnum, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { createdAt, createId, updatedAt } from '../utils'

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
    index('vendors_name_index').on(t.name),
    index('vendors_status_index').on(t.status),
  ],
)

export const vendorsRelations = relations(vendors, ({ many }) => ({
  users: many(vendorUsers),
}))

export const vendorUsers = pgTable(
  'vendor_users',
  (t) => ({
    vendorId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => vendors.id, { onDelete: 'cascade' }),
    userId: t.varchar({ length: 24 }).notNull(),
    role: vendorRoleEnum().default('staff').notNull(),
    createdAt,
  }),
  (t) => [
    primaryKey({ columns: [t.vendorId, t.userId] }),
    index('vendor_users_user_id_index').on(t.userId),
  ],
)

export const vendorUsersRelations = relations(vendorUsers, ({ one }) => ({
  vendor: one(vendors, {
    fields: [vendorUsers.vendorId],
    references: [vendors.id],
  }),
}))
