import type { TRPCRouterRecord } from '@trpc/server'

import { categories } from '@yuki/db/schema'
import { createCategorySchema } from '@yuki/validators/category'

import { sellerProcedure } from '../../trpc'

export const sellerCategoryRouter = {
  all: sellerProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
  }),

  create: sellerProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(categories).values(input)
    }),
} satisfies TRPCRouterRecord
