import { UserValidators } from '@yukinu/validators/user'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const userRouter = createTRPCRouter({
  all: protectedProcedure
    .meta({
      message: 'Users fetched successfully',
      role: ['admin'],
    })
    .input(UserValidators.allInput)
    .output(UserValidators.allOutput)
    .query(({ ctx, input }) => ctx.services.user.all(input)),

  one: protectedProcedure
    .meta({
      message: 'User fetched successfully',
      role: ['admin'],
    })
    .input(UserValidators.oneInput)
    .output(UserValidators.oneOutput)
    .query(({ ctx, input }) => ctx.services.user.one(input)),

  updateStatus: protectedProcedure
    .meta({
      message: 'User status updated successfully',
      role: ['admin'],
    })
    .input(UserValidators.updateStatusInput)
    .output(UserValidators.updateStatusOutput)
    .mutation(({ ctx, input }) => ctx.services.user.updateStatus(input)),

  profile: protectedProcedure
    .meta({ message: 'User profile fetched successfully' })
    .input(UserValidators.profileInput.omit({ userId: true }))
    .output(UserValidators.profileOutput)
    .query(({ ctx }) =>
      ctx.services.user.profile({ userId: ctx.session.userId }),
    ),

  updateProfile: protectedProcedure
    .meta({ message: 'User profile updated successfully' })
    .input(UserValidators.updateProfileInput)
    .output(UserValidators.updateProfileOutput)
    .mutation(({ ctx, input }) => ctx.services.user.updateProfile(input)),

  allAddresses: protectedProcedure
    .meta({ message: 'User addresses fetched successfully' })
    .input(UserValidators.allAddressesInput)
    .output(UserValidators.allAddressesOutput)
    .query(({ ctx, input }) => ctx.services.user.allAddresses(input)),

  oneAddress: protectedProcedure
    .meta({ message: 'User address fetched successfully' })
    .input(UserValidators.oneAddressInput)
    .output(UserValidators.oneAddressOutput)
    .query(({ ctx, input }) => ctx.services.user.oneAddress(input)),

  createAddress: protectedProcedure
    .meta({ message: 'User address created successfully' })
    .input(UserValidators.createAddressInput)
    .output(UserValidators.createAddressOutput)
    .mutation(({ ctx, input }) => ctx.services.user.createAddress(input)),

  updateAddress: protectedProcedure
    .meta({ message: 'User address updated successfully' })
    .input(UserValidators.updateAddressInput)
    .output(UserValidators.updateAddressOutput)
    .mutation(({ ctx, input }) => ctx.services.user.updateAddress(input)),

  deleteAddress: protectedProcedure
    .meta({ message: 'User address deleted successfully' })
    .input(UserValidators.deleteAddressInput)
    .mutation(({ ctx, input }) => ctx.services.user.deleteAddress(input)),

  wishlist: protectedProcedure
    .meta({ message: 'User wishlist fetched successfully' })
    .input(UserValidators.wishlistInput)
    .output(UserValidators.wishlistOutput)
    .query(({ ctx, input }) => ctx.services.user.wishlist(input)),

  toggleWishlistItem: protectedProcedure
    .meta({ message: 'User wishlist item toggled successfully' })
    .input(UserValidators.toggleWishlistItemInput)
    .output(UserValidators.toggleWishlistItemOutput)
    .mutation(({ ctx, input }) => ctx.services.user.toggleWishlistItem(input)),
})
