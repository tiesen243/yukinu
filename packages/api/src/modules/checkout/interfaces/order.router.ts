import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/checkout/types'
import type { VendorMiddleware } from '@/modules/merchant/interfaces/vendor.middleware'

import { AllOrdersDto } from '@/modules/checkout/application/dtos/order/all-orders.dto'
import { CheckoutDto } from '@/modules/checkout/application/dtos/order/checkout.dto'
import { OneOrderDto } from '@/modules/checkout/application/dtos/order/one-order.dto'
import { UpdateOrderStatusDto } from '@/modules/checkout/application/dtos/order/update-order-status'
import { protectedProcedure } from '@/trpc'

export const orderRouter = (
  { order }: UseCases,
  deps: {
    vendorMiddleware: VendorMiddleware
  },
) =>
  ({
    all: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(AllOrdersDto.input.pick({ page: true, limit: true }))
      .output(AllOrdersDto.output)
      .query(({ input }) => order.all.execute(input)),

    me: protectedProcedure
      .input(
        AllOrdersDto.input.pick({ page: true, limit: true, paymentId: true }),
      )
      .output(AllOrdersDto.output)
      .query(({ ctx, input }) =>
        order.all.execute({
          ...input,
          userId: ctx.session.userId,
        }),
      ),

    vendor: protectedProcedure
      .use(deps.vendorMiddleware)
      .input(AllOrdersDto.input.pick({ page: true, limit: true }))
      .output(AllOrdersDto.output)
      .query(({ ctx, input }) =>
        order.all.execute({ ...input, vendorId: ctx.session.vendorId }),
      ),

    one: protectedProcedure
      .input(OneOrderDto.input.pick({ id: true }))
      .output(OneOrderDto.output)
      .query(({ ctx, input }) =>
        order.one.execute({
          ...input,
          userId: ctx.session.userId,
          vendorId: null,
        }),
      ),

    checkout: protectedProcedure
      .input(CheckoutDto.input.omit({ userId: true }))
      .output(CheckoutDto.output)
      .mutation(({ ctx, input }) =>
        order.checkout.execute({ ...input, userId: ctx.session.userId }),
      ),

    updateStatus: protectedProcedure
      .use(deps.vendorMiddleware)
      .input(UpdateOrderStatusDto.input)
      .output(UpdateOrderStatusDto.output)
      .mutation(({ input }) => order.updateStatus.execute(input)),

    cancel: protectedProcedure
      .input(UpdateOrderStatusDto.input.pick({ id: true }))
      .output(UpdateOrderStatusDto.output)
      .mutation(({ input }) =>
        order.updateStatus.execute({
          id: input.id,
          status: 'cancelled',
        }),
      ),
  }) satisfies TRPCRouterRecord
