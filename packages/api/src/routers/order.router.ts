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

  one: protectedProcedure
    .meta({ message: 'Get order details successfully.' })
    .input(Validators.oneInput.pick({ id: true }))
    .output(Validators.oneOutput)
    .query(({ ctx, input }) =>
      ctx.services.order.one({
        ...input,
        userId: ctx.session.userId,
        vendorId: null,
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
