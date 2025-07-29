import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { and, desc, eq, ne } from '@yuki/db'
import { addresses } from '@yuki/db/schema'
import {
  addAdressSchema,
  byAdressIdSchema,
  updateAddressSchema,
} from '@yuki/validators/address'

import { protectedProcedure } from '../trpc'

export const addressRouter = {
  all: protectedProcedure.query(async ({ ctx }) =>
    ctx.db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, ctx.session.user.id))
      .orderBy(desc(addresses.name)),
  ),

  byId: protectedProcedure
    .input(byAdressIdSchema)
    .query(async ({ ctx, input }) => {
      const [address] = await ctx.db
        .select()
        .from(addresses)
        .where(eq(addresses.id, input.id))
        .limit(1)
      if (!address)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Address not found' })
      return address
    }),

  add: protectedProcedure
    .input(addAdressSchema)
    .mutation(async ({ ctx, input }) => {
      const count = await ctx.db.$count(
        addresses,
        eq(addresses.userId, ctx.session.user.id),
      )
      await ctx.db.insert(addresses).values({
        ...input,
        isDefault: count === 0,
        userId: ctx.session.user.id,
      })
    }),

  update: protectedProcedure
    .input(updateAddressSchema)
    .mutation(async ({ ctx, input: { id, ...values } }) =>
      ctx.db.transaction(async (tx) => {
        await tx.update(addresses).set(values).where(eq(addresses.id, id))

        if (values.isDefault)
          await tx
            .update(addresses)
            .set({ isDefault: false })
            .where(
              and(
                ne(addresses.id, id),
                eq(addresses.userId, ctx.session.user.id),
              ),
            )
      }),
    ),

  delete: protectedProcedure
    .input(byAdressIdSchema)
    .mutation(async ({ ctx, input }) =>
      ctx.db.transaction(async (tx) => {
        const [address] = await tx
          .select()
          .from(addresses)
          .where(eq(addresses.id, input.id))
          .limit(1)

        if (address?.isDefault)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Change the default address before removing this one',
          })

        await tx.delete(addresses).where(eq(addresses.id, input.id))
      }),
    ),
} satisfies TRPCRouterRecord
