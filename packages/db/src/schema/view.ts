import { eq, sql } from 'drizzle-orm'
import { pgView } from 'drizzle-orm/pg-core'

import {
  productImages,
  productReviews,
  products,
  productVariantGroups,
  productVariants,
} from '@/schema/product'
import { profiles } from '@/schema/profile'
import { users } from '@/schema/user'

export const usersView = pgView('users_view').as((qb) =>
  qb
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      role: users.role,
      status: users.status,
      avatarUrl: sql<string | null>`${profiles.avatarUrl}`.as('avatar_url'),
    })
    .from(users)
    .innerJoin(profiles, eq(users.id, profiles.id)),
)

export const productsView = pgView('products_view').as((qb) =>
  qb
    .select({
      id: products.id,
      name: products.name,
      imageUrl: sql<string>`MIN(${productImages.url})`.as('image_url'),
      price: products.price,
      stock: sql<number>`SUM(${productVariants.stock})`.as('stock'),
      minPrice: sql<number>`MIN(${productVariants.extraPrice})`.as('min_price'),
      maxPrice: sql<number>`MAX(${productVariants.extraPrice})`.as('max_price'),
      averageRating: sql<number>`AVG(${productReviews.rating})`.as(
        'average_rating',
      ),
    })
    .from(products)
    .where(eq(products.status, 'active'))
    .groupBy(products.id, products.name, products.price)
    .innerJoin(productImages, eq(products.id, productImages.productId))
    .innerJoin(
      productVariantGroups,
      eq(products.id, productVariantGroups.productId),
    )
    .innerJoin(
      productVariants,
      eq(productVariantGroups.id, productVariants.variantGroupId),
    )
    .innerJoin(productReviews, eq(products.id, productReviews.productId)),
)
