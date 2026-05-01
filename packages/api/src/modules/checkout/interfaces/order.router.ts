import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/checkout/types'

import { AllOrdersDto } from '@/modules/checkout/application/dtos/order/all-orders.dto'
import { CheckoutDto } from '@/modules/checkout/application/dtos/order/checkout.dto'
import { OneOrderDto } from '@/modules/checkout/application/dtos/order/one-order.dto'
import { protectedProcedure } from '@/trpc'

export const orderRouter = ({ order }: UseCases) =>
  ({
    all: protectedProcedure
      .input(AllOrdersDto.input.pick({ page: true, limit: true }))
      .output(AllOrdersDto.output)
      .query(({ ctx, input }) =>
        order.all.execute({
          ...input,
          userId: ctx.session.userId,
          vendorId: null,
          paymentId: null,
        }),
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
  }) satisfies TRPCRouterRecord
