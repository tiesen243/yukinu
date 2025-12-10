import { OrderValidators } from '@yukinu/validators/order'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const orderRouter = createTRPCRouter({
  one: protectedProcedure
    .input(OrderValidators.oneInput.omit({ userId: true }))
    .output(OrderValidators.oneOutput)
    .query(({ ctx, input }) =>
      ctx.services.order.one({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  addItemToCart: protectedProcedure
    .input(OrderValidators.addItemToCartInput.omit({ userId: true }))
    .output(OrderValidators.addItemToCartOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.order.addItemToCart({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  removeItemFromCart: protectedProcedure
    .input(OrderValidators.removeItemFromCartInput.omit({ userId: true }))
    .output(OrderValidators.removeItemFromCartOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.order.removeItemFromCart({
        ...input,
        userId: ctx.session.userId,
      }),
    ),
})
