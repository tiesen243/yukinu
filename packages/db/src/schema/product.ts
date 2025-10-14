import { relations, sql } from 'drizzle-orm'
import { check, index, pgEnum, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { createdAt, createId, updatedAt } from '../utils'
import { orderItems } from './order'
import { wishlistItems } from './profile'
import { users } from './user'
import { vendorCollectionItems, vendors } from './vendor'

export const productStatusEnum = pgEnum('product_status', [
  'active',
  'inactive',
  'out_of_stock',
])

export const categories = pgTable(
  'categories',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
    name: t.varchar({ length: 255 }).notNull(),
  }),
  (t) => [index('categories_name_idx').on(t.name)],
)

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export const products = pgTable(
  'products',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
    vendorId: t
      .varchar({ length: 24 })
      .references(() => vendors.id, { onDelete: 'set null' }),
    categoryId: t
      .varchar({ length: 24 })
      .references(() => categories.id, { onDelete: 'set null' }),
    name: t.varchar({ length: 255 }).notNull(),
    description: t.text(),
    price: t.numeric({ precision: 10, scale: 2 }).notNull(),
    stock: t.integer().default(0).notNull(),
    status: productStatusEnum().default('active').notNull(),
    createdAt,
    updatedAt,
  }),
  (t) => [
    index('products_vendor_id_idx').on(t.vendorId),
    index('products_category_id_idx').on(t.categoryId),
    index('products_name_idx').on(t.name),
    index('products_status_idx').on(t.status),
  ],
)

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  variants: many(productVariants),
  reviews: many(productReviews),

  vendor: one(vendors, {
    fields: [products.vendorId],
    references: [vendors.id],
  }),
  vendorCollectionItems: many(vendorCollectionItems),

  orderItems: many(orderItems),

  wishlistItems: many(wishlistItems),
}))

export const productImages = pgTable(
  'product_images',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    imageUrl: t.text().notNull(),
    altText: t.varchar({ length: 255 }),
  }),
  (t) => [index('product_images_product_id_idx').on(t.productId)],
)

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}))

export const productVariants = pgTable(
  'product_variants',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    name: t.varchar({ length: 255 }).notNull(),
    price: t.numeric({ precision: 10, scale: 2 }).notNull(),
    stock: t.integer().default(0).notNull(),
  }),
  (t) => [index('product_variants_product_id_idx').on(t.productId)],
)

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    orderItems: many(orderItems),
  }),
)

export const productReviews = pgTable(
  'product_reviews',
  (t) => ({
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
  }),
  (t) => [
    primaryKey({ columns: [t.productId, t.userId] }),
    index('product_reviews_product_id_idx').on(t.productId),
    index('product_reviews_user_id_idx').on(t.userId),
    check(
      'product_reviews_rating_check',
      sql`${t.rating} >= 1 AND ${t.rating} <= 5`,
    ),
  ],
)

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [productReviews.userId],
    references: [users.id],
  }),
}))
