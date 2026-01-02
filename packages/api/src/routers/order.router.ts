import { OrderValidators } from '@yukinu/validators/order'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const orderRouter = createTRPCRouter({
  one: protectedProcedure
    .meta({ message: 'Order fetched successfully.' })
    .input(OrderValidators.oneInput.omit({ userId: true }))
    .output(OrderValidators.oneOutput)
    .query(({ ctx, input }) =>
      ctx.services.order.one({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  addItemToCart: protectedProcedure
    .meta({ message: 'Item added to cart successfully.' })
    .input(OrderValidators.addItemToCartInput.omit({ userId: true }))
    .output(OrderValidators.addItemToCartOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.order.addItemToCart({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  removeItemFromCart: protectedProcedure
    .meta({ message: 'Item removed from cart successfully.' })
    .input(OrderValidators.removeItemFromCartInput.omit({ userId: true }))
    .output(OrderValidators.removeItemFromCartOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.order.removeItemFromCart({
        ...input,
        userId: ctx.session.userId,
      }),
    ),
})
