import { UserValidator } from '@yukinu/validators/user'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const userRouter = createTRPCRouter({
  all: protectedProcedure
    .meta({
      message: 'Fetched users successfully',
      roles: ['admin', 'moderator'],
    })
    .input(UserValidator.allParams)
    .query(({ ctx, input }) => ctx.userService.getUsers(input)),

  profile: protectedProcedure
    .meta({ message: 'Fetched profile successfully' })
    .query(({ ctx }) => ctx.userService.getUserProfile(ctx.session.user)),

  update: protectedProcedure
    .meta({
      message: 'User updated successfully',
      roles: ['admin', 'moderator'],
    })
    .input(UserValidator.updateUserBody)
    .mutation(({ ctx, input }) =>
      ctx.userService.updateUser(input, ctx.session.user),
    ),

  delete: protectedProcedure
    .meta({
      message: 'User deleted successfully',
      roles: ['admin', 'moderator'],
    })
    .input(UserValidator.oneParams)
    .mutation(({ ctx, input }) =>
      ctx.userService.deleteUser(input, ctx.session.user),
    ),

  updateProfile: protectedProcedure
    .meta({ message: 'Profile updated successfully' })
    .input(UserValidator.updateProfileBody)
    .mutation(({ ctx, input }) =>
      ctx.userService.updateUserProfile(ctx.session.user.id, input),
    ),
})
