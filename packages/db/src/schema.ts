import { relations } from 'drizzle-orm'
import { index, pgEnum, pgTable, primaryKey } from 'drizzle-orm/pg-core'

export const roles = pgEnum('role', ['admin', 'seller', 'user'])
export const users = pgTable(
  'user',
  (t) => ({
    id: t.varchar({ length: 25 }).primaryKey().$defaultFn(cuid).notNull(),
    name: t.varchar({ length: 255 }).notNull(),
    email: t.varchar({ length: 320 }).unique().notNull(),
    image: t.varchar({ length: 500 }).notNull(),
    role: roles().default('user').notNull(),
    createdAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [index('user_email_idx').on(t.email)],
)
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  verifiers: many(verifiers),
  addresses: many(addresses),
  cartItems: many(cartItems),
  orders: many(orders),

  products: many(products),
}))

export const accounts = pgTable(
  'account',
  (t) => ({
    provider: t.varchar({ length: 25 }).notNull(),
    accountId: t.varchar({ length: 128 }).notNull(),
    password: t.varchar({ length: 255 }),
    userId: t
      .varchar({ length: 25 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  }),
  (account) => [
    primaryKey({ columns: [account.provider, account.accountId] }),
    index('account_user_id_idx').on(account.userId),
    index('account_provider_idx').on(account.provider),
  ],
)
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessions = pgTable(
  'session',
  (t) => ({
    token: t.varchar({ length: 64 }).primaryKey().notNull(),
    userAgent: t.varchar({ length: 255 }).notNull(),
    expires: t.timestamp({ mode: 'date', withTimezone: true }).notNull(),
    userId: t
      .varchar({ length: 25 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  }),
  (t) => [index('session_user_id_idx').on(t.userId)],
)
export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const verifiers = pgTable(
  'verifier',
  (t) => ({
    token: t.varchar({ length: 64 }).primaryKey().notNull(),
    userId: t
      .varchar({ length: 25 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiration: t.timestamp({ mode: 'date', withTimezone: true }).notNull(),
  }),
  (t) => [
    index('verifier_user_id_idx').on(t.userId),
    index('verifier_token_idx').on(t.token),
  ],
)

export const verifiersRelations = relations(verifiers, ({ one }) => ({
  user: one(users, { fields: [verifiers.userId], references: [users.id] }),
}))

export const addresses = pgTable(
  'address',
  (t) => ({
    id: t.varchar({ length: 25 }).primaryKey().$defaultFn(cuid).notNull(),
    name: t.varchar({ length: 100 }).notNull(),
    phone: t.varchar({ length: 20 }).notNull(),
    line1: t.varchar({ length: 255 }).notNull(),
    line2: t.varchar({ length: 255 }),
    city: t.varchar({ length: 100 }).notNull(),
    state: t.varchar({ length: 100 }).notNull(),
    postalCode: t.varchar({ length: 20 }).notNull(),
    country: t.varchar({ length: 100 }).notNull(),
    isDefault: t.boolean().default(false).notNull(),
    userId: t
      .varchar({ length: 25 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  }),
  (t) => [index('address_user_id_idx').on(t.userId)],
)
export const addressesRelations = relations(addresses, ({ one, many }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
  orders: many(orders),
}))

export const categories = pgTable(
  'category',
  (t) => ({
    id: t.varchar({ length: 25 }).primaryKey().$defaultFn(cuid).notNull(),
    name: t.varchar({ length: 50 }).notNull(),
  }),
  (t) => [index('category_name_idx').on(t.name)],
)
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export const products = pgTable(
  'product',
  (t) => ({
    id: t.varchar({ length: 25 }).primaryKey().$defaultFn(cuid).notNull(),
    name: t.varchar({ length: 100 }).notNull(),
    description: t.text().notNull(),
    image: t.varchar({ length: 500 }).notNull(),
    stock: t.integer().notNull(),
    price: t.numeric().notNull(),
    discount: t.integer().default(0).notNull(),
    categoryId: t
      .varchar({ length: 25 })
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
    sellerId: t
      .varchar({ length: 25 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [
    index('product_name_idx').on(t.name),
    index('product_seller_idx').on(t.sellerId),
    index('product_category_idx').on(t.categoryId),
  ],
)
export const productsRelations = relations(products, ({ one, many }) => ({
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
}))

export const cartItems = pgTable(
  'cart_item',
  (t) => ({
    userId: t
      .varchar({ length: 25 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productId: t
      .varchar({ length: 25 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    quantity: t.integer().notNull(),
  }),
  (t) => [
    primaryKey({ columns: [t.userId, t.productId] }),
    index('cart_item_user_id_idx').on(t.userId),
    index('cart_item_product_id_idx').on(t.productId),
  ],
)
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
}))

export const orderItems = pgTable(
  'order_item',
  (t) => ({
    orderId: t
      .varchar({ length: 25 })
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: t
      .varchar({ length: 25 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    quantity: t.integer().notNull(),
    price: t.numeric().notNull(),
  }),
  (t) => [
    primaryKey({ columns: [t.orderId, t.productId] }),
    index('order_item_order_id_idx').on(t.orderId),
    index('order_item_product_id_idx').on(t.productId),
  ],
)
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}))

export const paymentMethods = pgEnum('payment_method', [
  'credit_card',
  'debit_card',
  'paypal',
  'bank_transfer',
  'cash_on_delivery',
])
export const paymentStatus = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
])
export const payments = pgTable(
  'payment',
  (t) => ({
    id: t.varchar({ length: 25 }).primaryKey().$defaultFn(cuid).notNull(),
    amount: t.numeric().notNull(),
    method: paymentMethods().notNull(),
    status: paymentStatus().default('pending').notNull(),
    orderId: t
      .varchar({ length: 25 })
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    createdAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [
    index('payment_order_id_idx').on(t.orderId),
    index('payment_status_idx').on(t.status),
  ],
)
export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}))

export const orderStatus = pgEnum('order_status', [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
])
export const orders = pgTable(
  'order',
  (t) => ({
    id: t.varchar({ length: 25 }).primaryKey().$defaultFn(cuid).notNull(),
    status: orderStatus().default('pending').notNull(),
    userId: t
      .varchar({ length: 25 })
      .notNull()
      .references(() => users.id, { onDelete: 'set null' }),
    addressId: t
      .varchar({ length: 25 })
      .notNull()
      .references(() => addresses.id, { onDelete: 'set null' }),
    createdAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [
    index('order_status_idx').on(t.status),
    index('order_user_id_idx').on(t.userId),
    index('order_address_id_idx').on(t.addressId),
  ],
)
export const ordersRelations = relations(orders, ({ one, many }) => ({
  orderItems: many(orderItems),
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  address: one(addresses, {
    fields: [orders.addressId],
    references: [addresses.id],
  }),
  payment: one(payments),
}))

function cuid(): string {
  const alphabet = 'abcdefghijklmnpqrstuvwxyz0123456789'
  const timestamp = Date.now().toString(36).padStart(8, '0')

  const randomBytes = crypto.getRandomValues(new Uint8Array(16))
  const randomPart = Array.from(
    randomBytes,
    (byte) => alphabet[byte % alphabet.length],
  ).join('')

  return `c${timestamp}${randomPart}`
}
