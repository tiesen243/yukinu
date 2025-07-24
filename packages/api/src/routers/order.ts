import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { and, eq } from '@yuki/db'
import { cartItems, orderItems, orders } from '@yuki/db/schema'
import { byIdSchema, createSchema } from '@yuki/validators/order'

import { protectedProcedure } from '../trpc'

export const orderRouter = {
  getUserOrders: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    return ctx.db.query.orders.findMany({
      where: (orders, { eq }) => eq(orders.userId, userId),
      with: { orderItems: { with: { product: true } } },
      orderBy: (orders, { desc }) => desc(orders.createdAt),
    })
  }),

  getUserOrder: protectedProcedure
    .input(byIdSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const order = await ctx.db.query.orders.findFirst({
        where: (orders, { and, eq }) =>
          and(eq(orders.id, input.id), eq(orders.userId, userId)),
        with: { address: true, orderItems: { with: { product: true } } },
      })

      if (!order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Order not found',
        })
      }

      return order
    }),

  create: protectedProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const { addressId, items } = input
      const userId = ctx.session.user.id

      const total = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      )

      return ctx.db.transaction(async (tx) => {
        const [insertedOrder] = await tx
          .insert(orders)
          .values({ addressId, total, userId })
          .returning()
        if (!insertedOrder)
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Order creation failed',
          })

        await tx.insert(orderItems).values(
          items.map((item) => ({
            ...item,
            orderId: insertedOrder.id,
          })),
        )

        await tx.delete(cartItems).where(eq(cartItems.userId, userId))

        return insertedOrder
      })
    }),

  cancel: protectedProcedure
    .input(byIdSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const order = await ctx.db.query.orders.findFirst({
        where: (orders, { and, eq }) =>
          and(eq(orders.id, input.id), eq(orders.userId, userId)),
      })
      if (!order)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Order not found',
        })
      if (order.status !== 'pending')
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Only pending orders can be cancelled',
        })

      await ctx.db
        .delete(orders)
        .where(and(eq(orders.id, input.id), eq(orders.userId, userId)))
    }),
} satisfies TRPCRouterRecord
