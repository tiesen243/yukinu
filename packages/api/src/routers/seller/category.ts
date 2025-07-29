import type { TRPCRouterRecord } from '@trpc/server'

import { categories } from '@yuki/db/schema'
import { createCategorySchema } from '@yuki/validators/category'

import { sellerProcedure } from '../../trpc'

export const sellerCategoryRouter = {
  create: sellerProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(categories).values(input)
    }),
} satisfies TRPCRouterRecord
