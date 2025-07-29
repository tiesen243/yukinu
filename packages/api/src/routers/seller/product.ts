import type { TRPCRouterRecord } from '@trpc/server'

import { and, eq } from '@yuki/db'
import { products } from '@yuki/db/schema'
import {
  byProductIdOrCategoryIdSchema,
  createProductSchema,
  updateProductSchema,
} from '@yuki/validators/product'

import { sellerProcedure } from '../../trpc'

export const sellerProductRouter = {
  create: sellerProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(products).values({
        ...input,
        discount: 0,
        sellerId: ctx.session.user.id,
      })
    }),

  update: sellerProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input: { id, ...values } }) => {
      await ctx.db
        .update(products)
        .set(values)
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
