import type { TRPCRouterRecord } from '@trpc/server'

import { eq } from '@yuki/db'
import { categories } from '@yuki/db/schema'
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
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(categories).where(eq(categories.id, input.id))
    }),
} satisfies TRPCRouterRecord
