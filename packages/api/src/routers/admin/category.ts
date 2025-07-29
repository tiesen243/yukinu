import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { eq } from '@yuki/db'
import { categories, products } from '@yuki/db/schema'
import {
  byCategoryIdSchema,
  updateCategorySchema,
} from '@yuki/validators/category'

import { adminProcedure } from '../../trpc'

export const adminCategoryRouter = {
  update: adminProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(categories)
        .set({ name: input.name })
        .where(eq(categories.id, input.id))
    }),

  delete: adminProcedure
    .input(byCategoryIdSchema)
    .mutation(async ({ ctx, input }) =>
      ctx.db.transaction(async (tx) => {
        const productCount = await tx.$count(
          products,
          eq(products.categoryId, input.id),
        )
        if (productCount > 0)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Category in use by products',
          })

        await ctx.db.delete(categories).where(eq(categories.id, input.id))
      }),
    ),
} satisfies TRPCRouterRecord
