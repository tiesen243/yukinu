import { createId } from '@yukinu/lib/create-id'
import { vendorStatuses } from '@yukinu/validators/vendor'
import { index, pgEnum, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { users } from '@/schema'
import { createdAt, updatedAt } from '@/schema/shared'

export const vendorStatusEnum = pgEnum('vendor_status', vendorStatuses)

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
    contact: t.varchar({ length: 100 }),
    payoutBankName: t.varchar({ length: 50 }),
    payoutAccountName: t.varchar({ length: 255 }),
    payoutAccountNumber: t.varchar({ length: 100 }),
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

export const vendorBalances = pgTable(
  'vendor_balances',
  (t) => ({
    vendorId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => vendors.id, { onDelete: 'restrict' }),
    balance: t.numeric({ precision: 10, scale: 2 }).notNull().default('0.00'),
    updatedAt: t.timestamp({ mode: 'date' }).defaultNow().notNull(),
  }),
  (t) => [
    primaryKey({ columns: [t.vendorId] }),
    index('vendor_balances_vendor_id_idx').on(t.vendorId),
  ],
)

export const vendorTransfers = pgTable(
  'vendor_transfers',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    vendorId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => vendors.id, { onDelete: 'restrict' }),
    reference: t.varchar({ length: 100 }).notNull(),
    amountIn: t.numeric({ precision: 10, scale: 2 }),
    amountOut: t.numeric({ precision: 10, scale: 2 }),
    createdAt,
  }),
  (t) => [index('vendor_transactions_vendor_id_idx').on(t.vendorId)],
)
