import { createId } from '@yukinu/lib/create-id'
import { isNotNull, isNull, sql } from 'drizzle-orm'
import { check, index, pgTable, uniqueIndex } from 'drizzle-orm/pg-core'

import { products, productVariants, users } from '@/schema'

export const cartItems = pgTable(
  'cart_items',
  (t) => ({
    id: t.varchar({ length: 24 }).$default(createId).primaryKey(),
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
