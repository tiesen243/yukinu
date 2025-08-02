import type { TRPCRouterRecord } from '@trpc/server'

import { eq } from '@yuki/db'
import { categories, products, users } from '@yuki/db/schema'

import { adminProcedure } from '../../trpc'

export const adminProductRouter = {
  all: adminProcedure.query(async ({ ctx }) => {
    const productList = await ctx.db
      .select({
        id: products.id,
        name: products.name,
        category: categories.name,
        price: products.price,
        stock: products.stock,
        seller: users.name,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(users, eq(products.sellerId, users.id))
    return productList
  }),

  byUser: adminProcedure.query(async ({ ctx }) => {
    const productList = await ctx.db
      .select({
        id: products.id,
        name: products.name,
        category: categories.name,
        price: products.price,
        stock: products.stock,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(eq(products.sellerId, ctx.session.user.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
    return productList
  }),
} satisfies TRPCRouterRecord
