import * as Validators from '@yukinu/validators/order'

import { createTRPCRouter, protectedProcedure, vendorProcedure } from '@/trpc'

export const orderRouter = createTRPCRouter({
  all: protectedProcedure
    .meta({ message: 'Orders fetched successfully.' })
    .input(Validators.allInput.omit({ userId: true }))
    .output(Validators.allOutput)
    .query(({ ctx, input }) =>
      ctx.services.order.all({ ...input, userId: ctx.session.userId }),
    ),

  allByVendor: vendorProcedure
    .meta({ message: 'Vendor orders fetched successfully.' })
    .input(Validators.allInput.omit({ vendorId: true }))
    .output(Validators.allOutput)
    .query(({ ctx, input }) =>
      ctx.services.order.all({ ...input, vendorId: ctx.vendorId }),
    ),

  one: protectedProcedure
    .meta({ message: 'Order fetched successfully.' })
    .input(Validators.oneInput.omit({ userId: true }))
    .output(Validators.oneOutput)
    .query(({ ctx, input }) =>
      ctx.services.order.one({ ...input, userId: ctx.session.userId }),
    ),

  checkout: protectedProcedure
    .meta({ message: 'Order checked out successfully.' })
    .input(Validators.checkoutInput.omit({ userId: true }))
    .output(Validators.checkoutOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.order.checkout({ ...input, userId: ctx.session.userId }),
    ),

  update: protectedProcedure
    .meta({ message: 'Order updated successfully.' })
    .input(Validators.updateInput.omit({ userId: true }))
    .output(Validators.updateOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.order.update({ ...input, userId: ctx.session.userId }),
    ),
})
