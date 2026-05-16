import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/sales/types'

import { GetWishlistDto } from '@/modules/sales/application/dtos/wishlist/get-wishlist.dto'
import { ToggleWishlistDto } from '@/modules/sales/application/dtos/wishlist/toggle-wishlist.dto'
import { protectedProcedure } from '@/trpc'

export const wishlistRouter = ({ wishlist }: UseCases) =>
  ({
    get: protectedProcedure
      .input(GetWishlistDto.input.omit({ userId: true }))
      .output(GetWishlistDto.output)
      .query(({ ctx, input }) =>
        wishlist.get.execute({ ...input, userId: ctx.session.userId }),
      ),

    toggle: protectedProcedure
      .input(ToggleWishlistDto.input.omit({ userId: true }))
      .output(ToggleWishlistDto.output)
      .mutation(({ ctx, input }) =>
        wishlist.toggle.execute({ ...input, userId: ctx.session.userId }),
      ),
  }) satisfies TRPCRouterRecord
