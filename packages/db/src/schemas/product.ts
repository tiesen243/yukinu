import { relations } from 'drizzle-orm'
import { index, pgEnum, pgTable } from 'drizzle-orm/pg-core'

import { createdAt, createId, updatedAt } from '../utils'
import { vendors } from './vendor'

export const productStatusEnum = pgEnum('product_status', [
  'active',
  'inactive',
  'out_of_stock',
])

export const categories = pgTable(
  'categories',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
    parentId: t.varchar({ length: 24 }),
    name: t.varchar({ length: 255 }).notNull(),
  }),
  (t) => [
    index('categories_parent_id_index').on(t.parentId),
    index('categories_name_index').on(t.name),
  ],
)

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories, { relationName: 'category_children' }),

  products: many(products),
}))

export const products = pgTable('products', (t) => ({
  id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
  vendorId: t
    .varchar({ length: 24 })
    .notNull()
    .references(() => vendors.id, { onDelete: 'cascade' }),
  categoryId: t
    .varchar({ length: 24 })
    .references(() => categories.id, { onDelete: 'set null' }),
  name: t.varchar({ length: 255 }).notNull(),
  description: t.text(),
  price: t.numeric({ precision: 12, scale: 2 }).notNull(),
  stock: t.integer().default(0).notNull(),
  status: productStatusEnum().default('active').notNull(),
  createdAt,
  updatedAt,
}))

export const productsRelations = relations(products, ({ one }) => ({
  vendor: one(vendors, {
    fields: [products.vendorId],
    references: [vendors.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}))

export const productImages = pgTable('product_images', (t) => ({
  id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
  productId: t
    .varchar({ length: 24 })
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  imageUrl: t.varchar({ length: 255 }).notNull(),
  altText: t.varchar({ length: 255 }),
  isPrimary: t.boolean().default(false).notNull(),
  createdAt,
}))

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}))

export const productVariants = pgTable('product_variants', (t) => ({
  id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
  productId: t
    .varchar({ length: 24 })
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  name: t.varchar({ length: 255 }).notNull(),
  price: t.numeric({ precision: 12, scale: 2 }).notNull(),
  stock: t.integer().default(0).notNull(),
}))

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  }),
)
