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

  update: protectedProcedure
    .meta({
      message: 'User updated successfully',
      role: ['admin'],
    })
    .input(UserValidators.updateInput.omit({ userId: true }))
    .output(UserValidators.updateOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.user.update({ ...input, userId: ctx.session.userId }),
    ),

  delete: protectedProcedure
    .meta({
      message: 'User deleted successfully',
      role: ['admin', 'moderator'],
    })
    .input(UserValidators.deleteInput.omit({ userId: true }))
    .output(UserValidators.deleteOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.user.delete({ ...input, userId: ctx.session.userId }),
    ),

  restore: protectedProcedure
    .meta({
      message: 'User restored successfully',
      role: ['admin', 'moderator'],
    })
    .input(UserValidators.restoreInput)
    .output(UserValidators.restoreOutput)
    .mutation(({ ctx, input }) => ctx.services.user.restore(input)),

  permanentlyDelete: protectedProcedure
    .meta({
      message: 'User permanently deleted successfully',
      role: ['admin'],
    })
    .input(UserValidators.permanentlyDeleteInput.omit({ userId: true }))
    .output(UserValidators.permanentlyDeleteOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.user.permanentlyDelete({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  profile: protectedProcedure
    .meta({ message: 'User profile fetched successfully' })
    .input(UserValidators.profileInput.omit({ userId: true }))
    .output(UserValidators.profileOutput)
    .query(({ ctx }) =>
      ctx.services.user.profile({ userId: ctx.session.userId }),
    ),

  updateProfile: protectedProcedure
    .meta({ message: 'User profile updated successfully' })
    .input(UserValidators.updateProfileInput.omit({ id: true }))
    .output(UserValidators.updateProfileOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.user.updateProfile({
        ...input,
        id: ctx.session.userId,
      }),
    ),

  allAddresses: protectedProcedure
    .meta({ message: 'User addresses fetched successfully' })
    .input(UserValidators.allAddressesInput.omit({ userId: true }))
    .output(UserValidators.allAddressesOutput)
    .query(({ ctx }) =>
      ctx.services.user.allAddresses({ userId: ctx.session.userId }),
    ),

  oneAddress: protectedProcedure
    .meta({ message: 'User address fetched successfully' })
    .input(UserValidators.oneAddressInput.omit({ userId: true }))
    .output(UserValidators.oneAddressOutput)
    .query(({ ctx, input }) =>
      ctx.services.user.oneAddress({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  createAddress: protectedProcedure
    .meta({ message: 'User address created successfully' })
    .input(UserValidators.createAddressInput.omit({ userId: true }))
    .output(UserValidators.createAddressOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.user.createAddress({ ...input, userId: ctx.session.userId }),
    ),

  updateAddress: protectedProcedure
    .meta({ message: 'User address updated successfully' })
    .input(UserValidators.updateAddressInput.omit({ userId: true }))
    .output(UserValidators.updateAddressOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.user.updateAddress({ ...input, userId: ctx.session.userId }),
    ),

  deleteAddress: protectedProcedure
    .meta({ message: 'User address deleted successfully' })
    .input(UserValidators.deleteAddressInput.omit({ userId: true }))
    .output(UserValidators.deleteAddressOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.user.deleteAddress({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  wishlist: protectedProcedure
    .meta({ message: 'User wishlist fetched successfully' })
    .input(UserValidators.wishlistInput.omit({ userId: true }))
    .output(UserValidators.wishlistOutput)
    .query(({ ctx }) =>
      ctx.services.user.wishlist({ userId: ctx.session.userId }),
    ),

  toggleWishlistItem: protectedProcedure
    .meta({ message: 'User wishlist item toggled successfully' })
    .input(UserValidators.toggleWishlistItemInput.omit({ userId: true }))
    .output(UserValidators.toggleWishlistItemOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.user.toggleWishlistItem({
        ...input,
        userId: ctx.session.userId,
      }),
    ),
})
