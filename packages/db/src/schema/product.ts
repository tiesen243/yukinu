import { index, pgTable, primaryKey, uniqueIndex } from 'drizzle-orm/pg-core'

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
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
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
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
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
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
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
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
    productId: t
      .varchar({ length: 24 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    sku: t.varchar({ length: 100 }).notNull(), // Stock Keeping Unit: variant_options ids joined by '-'
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
