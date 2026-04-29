import type { AnyPgColumn } from 'drizzle-orm/pg-core'

import { isNotNull, isNull, sql } from 'drizzle-orm'
import {
  check,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

//#region shared columns
const createdAt = timestamp({ mode: 'date' }).defaultNow().notNull()
const updatedAt = timestamp({ mode: 'date' })
  .defaultNow()
  .notNull()
  .$onUpdate(() => new Date())
const deletedAt = timestamp({ mode: 'date' })
//#endregion

//#region enums
export const userRoleEnum = pgEnum('user_role', [
  'user',
  'admin',
  'vendor_owner',
  'vendor_staff',
  'moderator',
])

export const userStatusEnum = pgEnum('user_status', ['active', 'inactive'])

export const vendorStatusEnum = pgEnum('vendor_status', [
  'pending',
  'approved',
  'rejected',
  'suspended',
])

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed',
  'shipped',
  'completed',
  'cancelled',
])

export const paymentMethodEnum = pgEnum('payment_method', [
  'bank_transfer',
  'cash_on_delivery',
])

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'success',
  'failed',
])

export const ticketStatusEnum = pgEnum('ticket_status', [
  'open',
  'resolved',
  'closed',
])
//#endregion

//#region user related tables
export const users = pgTable(
  'users',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    username: t.varchar({ length: 20 }).notNull(),
    email: t.varchar({ length: 255 }).notNull(),
    emailVerified: t.timestamp({ mode: 'date' }),
    role: userRoleEnum().default('user').notNull(),
    status: userStatusEnum().default('active').notNull(),
    image: t.varchar({ length: 500 }),
    createdAt,
    updatedAt,
    deletedAt,
  }),
  (t) => [
    uniqueIndex('users_username_idx').on(t.username),
    uniqueIndex('users_email_uq_idx').on(t.email),
  ],
)

export const profiles = pgTable('profiles', (t) => ({
  id: t
    .varchar({ length: 24 })
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  fullName: t.varchar({ length: 255 }),
  banner: t.varchar({ length: 500 }),
  bio: t.text(),
  gender: t.varchar({ length: 50 }),
  dateOfBirth: t.date(),
}))

export const addresses = pgTable(
  'addresses',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
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

export const accounts = pgTable(
  'accounts',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: t.varchar({ length: 50 }).notNull(),
    providerAccountId: t.varchar({ length: 100 }).notNull(),
    password: t.text(),
  }),
  (t) => [
    uniqueIndex('accounts_provider_account_id_uq_idx').on(
      t.provider,
      t.providerAccountId,
    ),
    index('accounts_user_id_idx').on(t.userId),
  ],
)

export const sessions = pgTable(
  'sessions',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: t.varchar({ length: 64 }).notNull(),
    expiresAt: t.timestamp({ mode: 'date' }).notNull(),
    ipAddress: t.varchar({ length: 45 }),
    userAgent: t.text(),
    createdAt,
  }),
  (t) => [
    index('sessions_user_id_idx').on(t.userId),
    uniqueIndex('sessions_id_token_uq_idx').on(t.id, t.token),
  ],
)

export const verifications = pgTable(
  'verifications',
  (t) => ({
    token: t.varchar({ length: 64 }).primaryKey(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: t.timestamp({ mode: 'date' }).notNull(),
    type: t.varchar({ length: 50 }).notNull(),
  }),
  (t) => [index('verifications_user_id_idx').on(t.userId)],
)

export const wishlistItems = pgTable(
  'wishlist_items',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
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

export const cartItems = pgTable(
  'cart_items',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    productVariantId: t
      .varchar({ length: 24 })
      .references(() => productVariants.id, { onDelete: 'cascade' }),
    quantity: t.integer().notNull(),
  }),
  (t) => [
    index('cart_items_user_id_idx').on(t.userId),
    uniqueIndex('cart_items_user_product_idx')
      .on(t.userId, t.productId)
      .where(isNull(t.productVariantId)),
    uniqueIndex('cart_items_user_product_variant_idx')
      .on(t.userId, t.productVariantId)
      .where(isNotNull(t.productVariantId)),
    check('cart_items_quantity_check', sql`${t.quantity} > 0`),
  ],
)
//#endregion

//#region vendor related tables
export const vendors = pgTable(
  'vendors',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
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
    id: t.varchar({ length: 24 }).primaryKey(),
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
//#endregion

//#region general tables
export const banners = pgTable('banners', (t) => ({
  id: t.varchar({ length: 24 }).primaryKey(),
  url: t.varchar({ length: 500 }).notNull(),
  createdAt: t.timestamp({ mode: 'date' }).defaultNow().notNull(),
}))

export const categories = pgTable(
  'categories',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    parentId: t
      .varchar({ length: 24 })
      .references((): AnyPgColumn => categories.id, { onDelete: 'set null' }),
    name: t.varchar({ length: 100 }).notNull(),
    description: t.text(),
    image: t.varchar({ length: 500 }),
  }),
  (t) => [uniqueIndex('categories_name_idx').on(t.name)],
)

export const vouchers = pgTable(
  'vouchers',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    code: t.varchar({ length: 50 }).notNull().unique(),
    discountAmount: t.numeric({ precision: 10, scale: 2 }),
    discountPercentage: t.integer(),
    quantity: t.integer().default(1).notNull(),
    expiryDate: t.timestamp().notNull(),
  }),
  (t) => [uniqueIndex('vouchers_code_uq_idx').on(t.code)],
)

export const tickets = pgTable(
  'tickets',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
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
//#endregion

//#region product related tables
export const products = pgTable(
  'products',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    vendorId: t
      .varchar({ length: 24 })
      .references(() => vendors.id, { onDelete: 'set null' }),
    categoryId: t
      .varchar({ length: 24 })
      .references(() => categories.id, { onDelete: 'set null' }),
    name: t.varchar({ length: 255 }).notNull(),
    description: t.text(),
    price: t.numeric({ precision: 10, scale: 2 }).notNull().default('0.00'),
    stock: t.integer().notNull().default(0),
    sold: t.integer().notNull().default(0),
    createdAt,
    updatedAt,
    deletedAt: t.timestamp(),
  }),
  (t) => [
    index('products_vendor_id_idx').on(t.vendorId),
    index('products_category_id_idx').on(t.categoryId),
    index('products_name_idx').on(t.name),
  ],
)

export const productImages = pgTable(
  'product_images',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    url: t.varchar({ length: 500 }).notNull(),
  }),
  (t) => [index('product_images_product_id_idx').on(t.productId)],
)

export const attributes = pgTable(
  'attributes',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    name: t.varchar({ length: 100 }).notNull(),
  }),
  (t) => [uniqueIndex('attributes_name_idx').on(t.name)],
)

export const productAttributes = pgTable(
  'product_attributes',
  (t) => ({
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    attributeId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => attributes.id, { onDelete: 'cascade' }),
    value: t.varchar({ length: 255 }).notNull(),
  }),
  (t) => [
    primaryKey({ columns: [t.productId, t.attributeId] }),
    index('product_attributes_product_id_idx').on(t.productId),
    index('product_attributes_attribute_id_idx').on(t.attributeId),
  ],
)

export const variants = pgTable(
  'variants',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    name: t.varchar({ length: 100 }).notNull(),
  }),
  (t) => [uniqueIndex('variants_name_idx').on(t.name)],
)

export const variantOptions = pgTable(
  'variant_options',
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
    variantId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => variants.id, { onDelete: 'cascade' }),
    value: t.varchar({ length: 100 }).notNull(),
  }),
  (t) => [
    index('variant_options_variant_id_idx').on(t.variantId),
    uniqueIndex('variant_options_variant_id_value_idx').on(
      t.variantId,
      t.value,
    ),
  ],
)

export const productVariants = pgTable(
  'product_variants',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    sku: t.varchar({ length: 100 }).notNull(),
    price: t.numeric({ precision: 10, scale: 2 }).notNull().default('0.00'),
    stock: t.integer().notNull().default(0),
  }),
  (t) => [
    index('product_variants_product_id_idx').on(t.productId),
    uniqueIndex('product_variants_product_id_sku_idx').on(t.productId, t.sku),
  ],
)

export const productReviews = pgTable(
  'product_reviews',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    rating: t.integer().notNull(),
    comment: t.text(),
    createdAt,
  }),
  (t) => [index('product_reviews_product_id_idx').on(t.productId)],
)

//#endregion

//#region order related tables
export const orders = pgTable(
  'orders',
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
    userId: t
      .varchar({ length: 24 })
      .references(() => users.id, { onDelete: 'set null' }),
    vendorId: t
      .varchar({ length: 24 })
      .references(() => vendors.id, { onDelete: 'set null' }),
    paymentId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => payments.id, { onDelete: 'restrict' }),
    addressId: t
      .varchar({ length: 24 })
      .references(() => addresses.id, { onDelete: 'set null' }),
    totalAmount: t
      .numeric({ precision: 10, scale: 2 })
      .notNull()
      .default('0.00'),
    status: orderStatusEnum().default('pending').notNull(),
    createdAt,
    updatedAt,
  }),
  (t) => [
    index('orders_user_id_idx').on(t.userId),
    index('orders_vendor_id_idx').on(t.vendorId),
  ],
)

export const orderItems = pgTable(
  'order_items',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
    orderId: t
      .integer()
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: t
      .varchar({ length: 24 })
      .references(() => products.id, { onDelete: 'set null' }),
    productVariantId: t
      .varchar({ length: 24 })
      .references(() => productVariants.id, { onDelete: 'set null' }),
    quantity: t.integer().notNull(),
    unitPrice: t.numeric({ precision: 10, scale: 2 }).notNull(),
  }),
  (t) => [
    index('order_items_order_id_idx').on(t.orderId),
    uniqueIndex('order_items_order_product_uq_idx')
      .on(t.orderId, t.productId)
      .where(isNull(t.productVariantId)),
    uniqueIndex('order_items_order_product_variant_uq_idx')
      .on(t.orderId, t.productVariantId)
      .where(isNotNull(t.productVariantId)),
  ],
)
//#endregion

//#region payment related tables
export const payments = pgTable('payments', (t) => ({
  id: t.varchar({ length: 24 }).primaryKey(),
  method: paymentMethodEnum().notNull(),
  methodReference: t.varchar({ length: 255 }),
  amount: t.numeric({ precision: 10, scale: 2 }).notNull(),
  voucherId: t
    .varchar({ length: 24 })
    .references(() => vouchers.id, { onDelete: 'set null' }),
  status: paymentStatusEnum().default('pending').notNull(),
  createdAt,
  updatedAt,
}))

export const transactions = pgTable(
  'transactions',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey(),
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
//#endregion
