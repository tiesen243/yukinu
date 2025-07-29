import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { and, eq } from '@yuki/db'
import { cartItems, orderItems, orders } from '@yuki/db/schema'
import { sendEmail } from '@yuki/email'
import {
  byOrderIdSchema,
  createOrderSchema,
  updateOrderSchema,
} from '@yuki/validators/order'

import { protectedProcedure } from '../trpc'

export const orderRouter = {
  all: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    return ctx.db.query.orders.findMany({
      where: (orders, { eq }) => eq(orders.userId, userId),
      with: { orderItems: { with: { product: true } } },
      orderBy: (orders, { desc }) => desc(orders.createdAt),
    })
  }),

  byId: protectedProcedure
    .input(byOrderIdSchema)
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
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const { addressId, items } = input
      const userId = ctx.session.user.id

      const total = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      )

      const { address, insertedOrder, productExists } =
        await ctx.db.transaction(async (tx) => {
          const address = await tx.query.addresses.findFirst({
            where: (t, { and, eq }) =>
              and(eq(t.id, addressId), eq(t.userId, userId)),
          })
          if (!address)
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Address not found',
            })

          const [insertedOrder] = await tx
            .insert(orders)
            .values({ addressId, total, userId })
            .returning()
          if (!insertedOrder)
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Order creation failed',
            })

          const productExists = await tx.query.products.findMany({
            where: (t, { inArray }) =>
              inArray(
                t.id,
                items.map((i) => i.productId),
              ),
          })
          if (productExists.length !== items.length) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'One or more products not found',
            })
          }

          await tx.insert(orderItems).values(
            items.map((item) => ({
              ...item,
              orderId: insertedOrder.id,
            })),
          )

          await tx.delete(cartItems).where(eq(cartItems.userId, userId))

          return { address, insertedOrder, productExists }
        })

      await sendEmail({
        email: 'OrderConfirmation',
        to: ctx.session.user.email,
        subject: 'Order Confirmation',
        text: `Your order #${insertedOrder.id} has been placed successfully.`,
        data: {
          user: ctx.session.user,
          order: {
            id: insertedOrder.id,
            total: insertedOrder.total,
            createdAt: insertedOrder.createdAt,
          },
          items: productExists.map((p) => ({
            productId: p.id,
            productName: p.name,
            productImage: p.image,
            productPrice: p.price,
            quantity: items.find((i) => i.productId === p.id)?.quantity ?? 0,
          })),
          address,
        },
      })

      return { id: insertedOrder.id }
    }),

  update: protectedProcedure
    .input(updateOrderSchema)
    .mutation(async ({ ctx, input: { id, status } }) => {
      const userId = ctx.session.user.id
      const query = and(eq(orders.id, id), eq(orders.userId, userId))

      const validTransitions: Record<string, string[]> = {
        pending: ['processing', 'cancelled'],
        processing: ['shipped', 'cancelled'],
        shipped: ['delivered'],
        delivered: [],
        cancelled: [],
      }

      await ctx.db.transaction(async (tx) => {
        const order = await tx.query.orders.findFirst({ where: query })
        if (!order)
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Order not found',
          })

        const allowedStatuses = validTransitions[order.status] ?? []
        if (!allowedStatuses.includes(status))
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Cannot change order status from ${order.status} to ${status}`,
          })

        await tx.update(orders).set({ status }).where(query)
      })
    }),
} satisfies TRPCRouterRecord
