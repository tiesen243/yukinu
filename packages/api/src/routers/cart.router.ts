import * as Validators from '@yukinu/validators/order'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const cartRouter = createTRPCRouter({
  get: protectedProcedure
    .meta({ message: 'Cart retrieved successfully.' })
    .output(Validators.oneOutput.pick({ items: true, totalAmount: true }))
    .query(({ ctx }) => ctx.services.cart.get({ userId: ctx.session.userId })),

  addItemToCart: protectedProcedure
    .meta({ message: 'Item added to cart successfully.' })
    .input(Validators.addItemToCartInput.omit({ userId: true }))
    .output(Validators.addItemToCartOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.cart.addItemToCart({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  removeItemFromCart: protectedProcedure
    .meta({ message: 'Item removed from cart successfully.' })
    .input(Validators.removeItemFromCartInput.omit({ userId: true }))
    .output(Validators.removeItemFromCartOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.cart.removeItemFromCart({
        ...input,
        userId: ctx.session.userId,
      }),
    ),
})
