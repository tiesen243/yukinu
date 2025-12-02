import { index, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'

import { createId } from '@yukinu/lib/create-id'

import { vendors } from '@/schema'
import { createdAt, updatedAt } from '@/schema/shared'

export const categories = pgTable(
  'categories',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    parentId: t.varchar({ length: 24 }),
    name: t.varchar({ length: 100 }).notNull(),
    image: t.varchar({ length: 500 }),
    description: t.text(),
  }),
  (t) => [uniqueIndex('categories_name_idx').on(t.name)],
)

export const products = pgTable(
  'products',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    vendorId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => vendors.id, { onDelete: 'cascade' }),
    categoryId: t
      .varchar({ length: 24 })
      .references(() => categories.id, { onDelete: 'set null' }),
    name: t.varchar({ length: 255 }).notNull(),
    description: t.text(),
    price: t.numeric({ precision: 10, scale: 2 }).notNull(),
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
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    url: t.varchar({ length: 500 }).notNull(),
  }),
  (t) => [index('product_images_product_id_idx').on(t.productId)],
)

export const productAttributes = pgTable(
  'product_attributes',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    key: t.varchar({ length: 100 }).notNull(),
    value: t.varchar({ length: 255 }).notNull(),
  }),
  (t) => [index('product_attributes_product_id_idx').on(t.productId)],
)

export const productVariants = pgTable(
  'product_variants',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    name: t.varchar({ length: 100 }).notNull(),
  }),
  (t) => [index('product_variants_product_id_idx').on(t.productId)],
)

export const productVariantOptions = pgTable(
  'product_variant_options',
  (t) => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
    variantId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => productVariants.id, { onDelete: 'cascade' }),
    value: t.varchar({ length: 100 }).notNull(),
  }),
  (t) => [index('product_variant_options_variant_id_idx').on(t.variantId)],
)

export const productVariantCombinations = pgTable(
  'product_variant_combinations',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    sku: t.varchar({ length: 50 }).notNull(), // [id_variantOptionId1]_[id_variantOptionId2]...
    extraPrice: t.numeric({ precision: 10, scale: 2 }).notNull().default('0'),
    stock: t.integer().notNull().default(0),
  }),
  (t) => [
    index('product_variant_combinations_product_id_idx').on(t.productId),
    uniqueIndex('product_variant_combinations_sku_idx').on(t.sku),
  ],
)

export const productReviews = pgTable(
  'product_reviews',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    userId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => vendors.id, { onDelete: 'cascade' }),
    rating: t.integer().notNull(),
    comment: t.text(),
    createdAt,
  }),
  (t) => [index('product_reviews_product_id_idx').on(t.productId)],
)
