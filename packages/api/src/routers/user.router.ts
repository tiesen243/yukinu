import { UserValidators } from '@yukinu/validators/user'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const userRouter = createTRPCRouter({
  updateStatus: protectedProcedure
    .meta({
      message: 'User status updated successfully',
      role: ['admin', 'moderator'],
    })
    .input(UserValidators.updateStatusInput)
    .output(UserValidators.updateStatusOutput)
    .mutation(() => {
      throw new Error('Not implemented')
    }),

  getProfile: protectedProcedure
    .meta({ message: 'User profile fetched successfully' })
    .input(UserValidators.getProfileInput.omit({ userId: true }))
    .output(UserValidators.getProfileOutput)
    .query(({ ctx }) =>
      ctx.services.user.getProfile({ userId: ctx.session.userId }),
    ),

  updateProfile: protectedProcedure
    .meta({ message: 'User profile updated successfully' })
    .input(UserValidators.updateProfileInput)
    .output(UserValidators.updateProfileOutput)
    .mutation(() => {
      throw new Error('Not implemented')
    }),

  getAddresses: protectedProcedure
    .meta({ message: 'User addresses fetched successfully' })
    .input(UserValidators.getAddressesInput)
    .output(UserValidators.getAddressesOutput)
    .query(() => {
      throw new Error('Not implemented')
    }),

  getAddress: protectedProcedure
    .meta({ message: 'User address fetched successfully' })
    .input(UserValidators.getAddressInput)
    .output(UserValidators.getAddressOutput)
    .query(() => {
      throw new Error('Not implemented')
    }),

  createAddress: protectedProcedure
    .meta({ message: 'User address created successfully' })
    .input(UserValidators.createAddressInput)
    .output(UserValidators.createAddressOutput)
    .mutation(() => {
      throw new Error('Not implemented')
    }),

  updateAddress: protectedProcedure
    .meta({ message: 'User address updated successfully' })
    .input(UserValidators.updateAddressInput)
    .output(UserValidators.updateAddressOutput)
    .mutation(() => {
      throw new Error('Not implemented')
    }),

  deleteAddress: protectedProcedure
    .meta({ message: 'User address deleted successfully' })
    .input(UserValidators.deleteAddressInput)
    .mutation(() => {
      throw new Error('Not implemented')
    }),

  getWishlist: protectedProcedure
    .meta({ message: 'User wishlist fetched successfully' })
    .input(UserValidators.getWishlistInput)
    .output(UserValidators.getWishlistOutput)
    .query(() => {
      throw new Error('Not implemented')
    }),

  toggleWishlistItem: protectedProcedure
    .meta({ message: 'User wishlist item toggled successfully' })
    .input(UserValidators.toggleWishlistItemInput)
    .output(UserValidators.toggleWishlistItemOutput)
    .mutation(() => {
      throw new Error('Not implemented')
    }),
})
