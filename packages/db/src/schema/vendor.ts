import { index, pgEnum, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { createId } from '@yukinu/lib/create-id'
import { VendorValidators } from '@yukinu/validators/vendor'

import { users } from '@/schema'
import { createdAt, updatedAt } from '@/schema/shared'

export const vendorStatusEnum = pgEnum(
  'vendor_status',
  VendorValidators.statuses,
)

export const vendors = pgTable(
  'vendors',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    ownerId: t
      .varchar({ length: 24 })
      .references(() => users.id, { onDelete: 'set null' }),
    name: t.varchar({ length: 255 }).notNull(),
    description: t.text(),
    image: t.varchar({ length: 500 }),
    address: t.varchar({ length: 500 }),
    status: vendorStatusEnum().default('pending').notNull(),
    createdAt,
    updatedAt,
  }),
  (t) => [index('vendors_owner_id_idx').on(t.ownerId)],
)

export const vendorStaffs = pgTable(
  'vendor_staffs',
  (t) => ({
    vendorId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => vendors.id, { onDelete: 'cascade' }),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    assignedAt: t.timestamp({ mode: 'date' }).defaultNow().notNull(),
  }),
  (t) => [
    primaryKey({ columns: [t.vendorId, t.userId] }),
    index('vendor_staffs_vendor_id_idx').on(t.vendorId),
  ],
)

export const payouts = pgTable(
  'payouts',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    vendorId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => vendors.id, { onDelete: 'cascade' }),
    amount: t.numeric({ precision: 10, scale: 2 }).notNull(),
    processedAt: t.timestamp({ mode: 'date' }),
  }),
  (t) => [index('payouts_vendor_id_idx').on(t.vendorId)],
)
