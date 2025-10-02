import { relations, sql } from 'drizzle-orm'
import { check, index, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'

import { createdAt, createId } from '../utils'
import { products } from './product'
import { users } from './user'

export const reviews = pgTable(
  'reviews',
  (t) => ({
    id: t.varchar({ length: 24 }).primaryKey().$default(createId).notNull(),
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
  (t) => [
    check('table_rating_check', sql`${t.rating} >= 1 AND ${t.rating} <= 5`),
    index('reviews_product_id_idx').on(t.productId),
    index('reviews_user_id_idx').on(t.userId),
    uniqueIndex('reviews_product_user_id_uq').on(t.productId, t.userId),
  ],
)

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}))
