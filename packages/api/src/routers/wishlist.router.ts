import * as Validators from '@yukinu/validators/general'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const wishlistRouter = createTRPCRouter({
  get: protectedProcedure
    .meta({
      message: 'Wishlist items fetched successfully',
    })
    .input(Validators.allWishlistItemsInput.omit({ userId: true }))
    .output(Validators.allWishlistItemsOutput)
    .query(({ ctx, input }) =>
      ctx.services.wishlist.get({ ...input, userId: ctx.session.userId }),
    ),

  toggleItem: protectedProcedure
    .meta({
      message: 'Wishlist item toggled successfully',
    })
    .input(Validators.toggleWishlistItemInput.omit({ userId: true }))
    .output(Validators.toggleWishlistItemOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.wishlist.toggleItem({
        ...input,
        userId: ctx.session.userId,
      }),
    ),
})
