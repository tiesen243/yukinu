import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { and, desc, eq, ne } from '@yuki/db'
import { addresses } from '@yuki/db/schema'
import { addSchema, byIdSchema, updateSchema } from '@yuki/validators/address'

import { protectedProcedure } from '../trpc'

export const addressRouter = {
  all: protectedProcedure.query(async ({ ctx }) =>
    ctx.db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, ctx.session.user.id))
      .orderBy(desc(addresses.name)),
  ),

  byId: protectedProcedure.input(byIdSchema).query(async ({ ctx, input }) => {
    const [address] = await ctx.db
      .select()
      .from(addresses)
      .where(eq(addresses.id, input.id))
      .limit(1)
    if (!address)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Address not found' })
    return address
  }),

  add: protectedProcedure.input(addSchema).mutation(async ({ ctx, input }) => {
    const count = await ctx.db.$count(
      addresses,
      eq(addresses.userId, ctx.session.user.id),
    )
    await ctx.db.insert(addresses).values({
      ...input,
      isDefault: count === 0,
      userId: ctx.session.user.id,
    })
    return { message: 'Address added successfully' }
  }),

  update: protectedProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(addresses)
        .set(input)
        .where(eq(addresses.id, input.id))

      if (input.isDefault)
        await ctx.db
          .update(addresses)
          .set({ isDefault: false })
          .where(
            and(
              ne(addresses.id, input.id),
              eq(addresses.userId, ctx.session.user.id),
            ),
          )

      return { message: 'Address updated successfully' }
    }),

  remove: protectedProcedure
    .input(byIdSchema)
    .mutation(async ({ ctx, input }) => {
      const [address] = await ctx.db
        .select()
        .from(addresses)
        .where(eq(addresses.id, input.id))
        .limit(1)
      if (!address)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Address not found' })
      if (address.isDefault)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Change the default address before removing this one',
        })

      await ctx.db.delete(addresses).where(eq(addresses.id, input.id))
      return { message: 'Address removed successfully' }
    }),
} satisfies TRPCRouterRecord
