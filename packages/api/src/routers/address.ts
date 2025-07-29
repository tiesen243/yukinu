import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { and, desc, eq, ne } from '@yuki/db'
import { addresses } from '@yuki/db/schema'
import {
  addAddressSchema,
  byAddressIdSchema,
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
    .input(byAddressIdSchema)
    .query(async ({ ctx, input }) => {
      const [address] = await ctx.db
        .select()
        .from(addresses)
        .where(
          and(
            eq(addresses.id, input.id),
            eq(addresses.userId, ctx.session.user.id),
          ),
        )
        .limit(1)
      if (!address)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Address not found' })
      return address
    }),

  add: protectedProcedure
    .input(addAddressSchema)
    .mutation(async ({ ctx, input }) => {
      const addressCount = await ctx.db.$count(
        addresses,
        eq(addresses.userId, ctx.session.user.id),
      )
      await ctx.db.insert(addresses).values({
        ...input,
        isDefault: addressCount === 0,
        userId: ctx.session.user.id,
      })
    }),

  update: protectedProcedure
    .input(updateAddressSchema)
    .mutation(async ({ ctx, input: { id, ...values } }) =>
      ctx.db.transaction(async (tx) => {
        await tx
          .update(addresses)
          .set(values)
          .where(
            and(
              eq(addresses.id, id),
              eq(addresses.userId, ctx.session.user.id),
            ),
          )

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
    .input(byAddressIdSchema)
    .mutation(async ({ ctx, input }) =>
      ctx.db.transaction(async (tx) => {
        const query = and(
          eq(addresses.id, input.id),
          eq(addresses.userId, ctx.session.user.id),
        )

        const [address] = await tx
          .select()
          .from(addresses)
          .where(query)
          .limit(1)

        if (address?.isDefault)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Change the default address before removing this one',
          })

        await tx.delete(addresses).where(query)
      }),
    ),
} satisfies TRPCRouterRecord
