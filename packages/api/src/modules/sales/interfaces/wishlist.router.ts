import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/sales/types'

import { GetWishlistDto } from '@/modules/sales/application/dtos/wishlist/get-wishlist.dto'
import { ToggleWishlistDto } from '@/modules/sales/application/dtos/wishlist/toggle-wishlist.dto'
import { protectedProcedure } from '@/trpc'

export const wishlistRouter = ({ wishlist }: UseCases) =>
  ({
    get: protectedProcedure
      .input(GetWishlistDto.input)
      .output(GetWishlistDto.output)
      .query(({ input }) => wishlist.get.execute(input)),

    toggle: protectedProcedure
      .input(ToggleWishlistDto.input)
      .output(ToggleWishlistDto.output)
      .mutation(({ input }) => wishlist.toggle.execute(input)),
  }) satisfies TRPCRouterRecord
