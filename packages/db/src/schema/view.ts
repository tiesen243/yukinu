import { eq, sql } from 'drizzle-orm'
import { pgView } from 'drizzle-orm/pg-core'

import {
  categories,
  productImages,
  productReviews,
  products,
  productVariantGroups,
  productVariants,
} from '@/schema/product'
import { profiles } from '@/schema/profile'
import { users } from '@/schema/user'
import { vendors } from '@/schema/vendor'

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
      category: {
        id: sql<string>`${categories.id}`.as('category_id'),
        name: sql<string>`${categories.name}`.as('category_name'),
      },
      vendor: {
        id: sql<string>`${vendors.id}`.as('vendor_id'),
        name: sql<string>`${vendors.name}`.as('vendor_name'),
      },
      status: products.status,
      imageUrl: sql<string>`MIN(${productImages.url})`.as('image_url'),
      price: products.price,
      stock: products.stock,
      minPrice: sql<string>`MIN(${productVariants.extraPrice})`.as('min_price'),
      maxPrice: sql<string>`MAX(${productVariants.extraPrice})`.as('max_price'),
      averageRating: sql<number>`AVG(${productReviews.rating})`.as(
        'average_rating',
      ),
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(vendors, eq(vendors.id, products.vendorId))
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .leftJoin(
      productVariantGroups,
      eq(products.id, productVariantGroups.productId),
    )
    .leftJoin(
      productVariants,
      eq(productVariantGroups.id, productVariants.variantGroupId),
    )
    .leftJoin(productReviews, eq(products.id, productReviews.productId))
    .groupBy(
      products.id,
      products.name,
      products.status,
      products.price,
      products.stock,

      categories.id,
      categories.name,
      vendors.id,
      vendors.name,
    ),
)
