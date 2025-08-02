import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { and, eq } from '@yuki/db'
import { categories, products, users } from '@yuki/db/schema'
import {
  byProductIdOrCategoryIdSchema,
  createProductSchema,
  getAllProductsSchema,
  updateProductSchema,
} from '@yuki/validators/product'

import { sellerProcedure } from '../../trpc'

export const sellerProductRouter = {
  all: sellerProcedure
    .input(getAllProductsSchema)
    .query(async ({ ctx, input }) => {
      if (!input.isCurrentUser && ctx.session.user.role !== 'admin')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not allowed to view all products.',
        })

      let where = undefined
      if (input.isCurrentUser)
        where = eq(products.sellerId, ctx.session.user.id)

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
        .where(where)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .innerJoin(users, eq(products.sellerId, users.id))

      return productList
    }),

  create: sellerProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(products).values({
        ...input,
        price: input.price.toString(),
        discount: 0,
        sellerId: ctx.session.user.id,
      })
    }),

  update: sellerProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input: { id, ...values } }) => {
      await ctx.db
        .update(products)
        .set({
          ...values,
          price: values.price.toString(),
        })
        .where(
          and(eq(products.id, id), eq(products.sellerId, ctx.session.user.id)),
        )
    }),

  delete: sellerProcedure
    .input(byProductIdOrCategoryIdSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(products)
        .where(
          and(
            eq(products.id, input.id),
            eq(products.sellerId, ctx.session.user.id),
          ),
        )
    }),
} satisfies TRPCRouterRecord
