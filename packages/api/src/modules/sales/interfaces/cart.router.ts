import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/sales/types'

import { GetCartDto } from '@/modules/sales/application/dtos/cart/get-cart.dto'
import { RemoveCartItemDto } from '@/modules/sales/application/dtos/cart/remove-cart-item.dto'
import { SaveCartItemDto } from '@/modules/sales/application/dtos/cart/save-cart-item.dto'
import { protectedProcedure } from '@/trpc'

export const cartRouter = ({ cart }: UseCases) =>
  ({
    get: protectedProcedure
      .input(GetCartDto.input.omit({ userId: true }))
      .output(GetCartDto.output)
      .query(({ ctx, input }) =>
        cart.get.execute({ ...input, userId: ctx.session.userId }),
      ),

    save: protectedProcedure
      .input(SaveCartItemDto.input.omit({ userId: true }))
      .output(SaveCartItemDto.output)
      .mutation(({ ctx, input }) =>
        cart.save.execute({ ...input, userId: ctx.session.userId }),
      ),

    remove: protectedProcedure
      .input(RemoveCartItemDto.input.omit({ userId: true }))
      .output(RemoveCartItemDto.output)
      .mutation(({ ctx, input }) =>
        cart.remove.execute({ ...input, userId: ctx.session.userId }),
      ),
  }) satisfies TRPCRouterRecord
