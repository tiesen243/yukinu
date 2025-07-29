import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { and, eq } from '@yuki/db'
import { cartItems, products } from '@yuki/db/schema'
import { updateCartSchema } from '@yuki/validators/cart'

import { protectedProcedure } from '../trpc'

export const cartRouter = {
  get: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const cartItems = await ctx.db.query.cartItems.findMany({
      where: (t, { eq }) => eq(t.userId, userId),
      with: { product: true },
    })

    const totalPrice = cartItems.reduce((sum, item) => {
      const price = item.product.price * item.quantity
      const discount = item.product.discount / 100
      return sum + price * (1 - discount)
    }, 0)

    return {
      totalPrice: totalPrice.toFixed(2),
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        productStock: item.product.stock,
        quantity: item.quantity,
        price: item.product.price,
        discount: item.product.discount,
        totalPrice: (
          item.product.price *
          item.quantity *
          (1 - item.product.discount / 100)
        ).toFixed(2),
      })),
    }
  }),

  update: protectedProcedure
    .input(updateCartSchema)
    .mutation(async ({ ctx, input }) => {
      const { productId, quantity, type } = input
      const userId = ctx.session.user.id

      const where = and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, productId),
      )

      const [cartItem, product] = await Promise.all([
        ctx.db.query.cartItems.findFirst({ where }),
        ctx.db.query.products.findFirst({
          where: eq(products.id, productId),
        }),
      ])
      if (!product)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        })

      if (type === 'remove') {
        if (cartItem) await ctx.db.delete(cartItems).where(where)
        return
      }

      const finalQuantity = cartItem
        ? type === 'increment'
          ? cartItem.quantity + quantity
          : quantity
        : quantity
      if (finalQuantity > product.stock)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Insufficient stock available',
        })

      await ctx.db
        .insert(cartItems)
        .values({ userId, productId, quantity: finalQuantity })
        .onConflictDoUpdate({
          target: [cartItems.userId, cartItems.productId],
          set: { quantity: finalQuantity },
        })
    }),
} satisfies TRPCRouterRecord
