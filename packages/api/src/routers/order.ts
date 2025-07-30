import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { and, eq } from '@yuki/db'
import { cartItems, orderItems, orders, payments } from '@yuki/db/schema'
import { sendEmail } from '@yuki/email'
import {
  byOrderIdSchema,
  createOrderSchema,
  updateOrderSchema,
} from '@yuki/validators/order'

import { protectedProcedure } from '../trpc'

const VALID_ORDER_TRANSITIONS: Record<string, string[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

const VALID_PAYMENT_TRANSITIONS: Record<string, string[]> = {
  pending: ['completed', 'failed'],
  completed: [],
  failed: ['refunded'],
  refunded: [],
}

export const orderRouter = {
  all: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    return ctx.db.query.orders.findMany({
      where: (orders, { eq }) => eq(orders.userId, userId),
      with: {
        orderItems: { with: { product: true } },
        payment: { columns: { amount: true } },
      },
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
        with: {
          address: true,
          orderItems: { with: { product: true } },
          payment: true,
        },
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
            .values({ addressId, userId })
            .returning()
          if (!insertedOrder)
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Order creation failed',
            })
          await tx.insert(payments).values({
            amount: total,
            orderId: insertedOrder.id,
            method: input.paymentMethod,
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

          return { address, insertedOrder, productExists, total }
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
            total,
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
    .mutation(async ({ ctx, input: { id, orderStatus, paymentStatus } }) => {
      const userId = ctx.session.user.id
      const query = and(eq(orders.id, id), eq(orders.userId, userId))

      await ctx.db.transaction(async (tx) => {
        const order = await tx.query.orders.findFirst({ where: query })
        if (!order)
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Order not found',
          })

        if (orderStatus) {
          const allowedStatuses = VALID_ORDER_TRANSITIONS[order.status] ?? []
          if (!allowedStatuses.includes(orderStatus))
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Cannot change order status from ${order.status} to ${orderStatus}`,
            })

          await tx.update(orders).set({ status: orderStatus }).where(query)
          if (orderStatus === 'cancelled') {
            const query = eq(payments.orderId, id)

            const payment = await tx.query.payments.findFirst({ where: query })
            if (!payment) return

            if (payment.status === 'completed')
              await tx.update(payments).set({ status: 'refunded' }).where(query)
            else if (payment.status === 'pending')
              await tx.update(payments).set({ status: 'failed' }).where(query)
          }
        }

        if (paymentStatus) {
          const payment = await tx.query.payments.findFirst({
            where: eq(payments.orderId, id),
          })
          if (!payment)
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Payment not found',
            })
          const allowedStatuses =
            VALID_PAYMENT_TRANSITIONS[payment.status] ?? []
          if (!allowedStatuses.includes(paymentStatus))
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Cannot change payment status from ${payment.status} to ${paymentStatus}`,
            })

          await tx
            .update(payments)
            .set({ status: paymentStatus })
            .where(eq(payments.id, payment.id))
        }
      })
    }),
} satisfies TRPCRouterRecord
