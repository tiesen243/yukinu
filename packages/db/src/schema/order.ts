import { isNotNull, isNull } from 'drizzle-orm'
import { index, pgEnum, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'

import { createId } from '@yukinu/lib/create-id'
import { OrderValidators } from '@yukinu/validators/order'

import { addresses, products, productVariants, users, vendors } from '@/schema'
import { createdAt, updatedAt } from '@/schema/shared'

export const orderStatusEnum = pgEnum(
  'order_status',
  OrderValidators.orderStatuses,
)

export const paymentMethodEnum = pgEnum(
  'payment_method',
  OrderValidators.paymentMethods,
)

export const paymentStatusEnum = pgEnum(
  'payment_status',
  OrderValidators.paymentStatuses,
)

export const orders = pgTable(
  'orders',
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
    userId: t
      .varchar({ length: 24 })
      .references(() => users.id, { onDelete: 'set null' }),
    addressId: t
      .varchar({ length: 24 })
      .references(() => addresses.id, { onDelete: 'set null' }),
    voucherId: t
      .varchar({ length: 24 })
      .references(() => vouchers.id, { onDelete: 'set null' }),
    totalAmount: t
      .numeric({ precision: 10, scale: 2 })
      .notNull()
      .default('0.00'),
    status: orderStatusEnum().default('pending').notNull(),
    createdAt,
    updatedAt,
  }),
  (t) => [index('orders_user_id_idx').on(t.userId)],
)

export const orderItems = pgTable(
  'order_items',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    orderId: t
      .integer()
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    vendorId: t
      .varchar({ length: 24 })
      .references(() => vendors.id, { onDelete: 'set null' }),
    productId: t
      .varchar({ length: 24 })
      .references(() => products.id, { onDelete: 'set null' }),
    productVariantId: t
      .varchar({ length: 24 })
      .references(() => productVariants.id, { onDelete: 'set null' }),
    quantity: t.integer().notNull(),
    unitPrice: t.numeric({ precision: 10, scale: 2 }).notNull(),
    isCompleted: t.boolean().default(false).notNull(), // vendor marks item as completed
  }),
  (t) => [
    index('order_items_order_id_idx').on(t.orderId),
    index('order_items_vendor_id_idx').on(t.vendorId),
    uniqueIndex('order_items_order_product_uq_idx')
      .on(t.orderId, t.productId)
      .where(isNull(t.productVariantId)),
    uniqueIndex('order_items_order_product_variant_uq_idx')
      .on(t.orderId, t.productVariantId)
      .where(isNotNull(t.productVariantId)),
  ],
)

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

export const payments = pgTable(
  'payments',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    orderId: t
      .integer()
      .notNull()
      .references(() => orders.id, { onDelete: 'restrict' }),
    method: paymentMethodEnum().notNull(),
    amount: t.numeric({ precision: 10, scale: 2 }).notNull(),
    methodReference: t.varchar({ length: 255 }),
    status: paymentStatusEnum().default('pending').notNull(),
    createdAt,
    updatedAt,
  }),
  (t) => [index('payments_order_id_idx').on(t.orderId)],
)

export const transactions = pgTable(
  'transactions',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    paymentId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => payments.id, { onDelete: 'restrict' }),
    gateway: t.varchar({ length: 100 }).notNull(),
    transactionDate: t.timestamp().notNull().defaultNow(),
    amountIn: t.numeric({ precision: 20, scale: 2 }).notNull().default('0.00'),
    amountOut: t.numeric({ precision: 20, scale: 2 }).notNull().default('0.00'),
    transactionContent: t.text(),
    referenceNumber: t.varchar({ length: 255 }),
    body: t.text(),
    createdAt: t.timestamp().notNull().defaultNow(),
  }),
  (t) => [
    uniqueIndex('transactions_reference_number_uq_idx').on(t.referenceNumber),
  ],
)
