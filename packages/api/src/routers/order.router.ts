import * as Validators from '@yukinu/validators/order'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const orderRouter = createTRPCRouter({
  all: protectedProcedure
    .meta({ message: 'Get all orders successfully.' })
    .input(Validators.allInput.pick({ page: true, limit: true }))
    .output(Validators.allOutput)
    .query(({ ctx, input }) =>
      ctx.services.order.all({
        ...input,
        userId: ctx.session.userId,
        vendorId: null,
        paymentId: null,
      }),
    ),

  checkout: protectedProcedure
    .meta({ message: 'Order checked out successfully.' })
    .input(Validators.checkoutInput.omit({ userId: true }))
    .output(Validators.checkoutOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.order.checkout({ ...input, userId: ctx.session.userId }),
    ),
})
