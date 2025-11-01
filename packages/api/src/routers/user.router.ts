import { UserValidator } from '@yukinu/validators/user'

import { createTRPCRouter, managerProcedure, protectedProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  all: managerProcedure
    .input(UserValidator.findByQueryWithPaginationQuery)
    .query(({ ctx, input }) => ctx.userService.getUsers(input)),

  profile: protectedProcedure.query(({ ctx }) =>
    ctx.userService.getUserProfile(ctx.session.user),
  ),

  update: managerProcedure
    .input(UserValidator.updateUserBody)
    .mutation(({ ctx, input }) =>
      ctx.userService.updateUser(input, ctx.session.user),
    ),

  updateProfile: protectedProcedure
    .input(UserValidator.updateProfileBody)
    .mutation(({ ctx, input }) =>
      ctx.userService.updateUserProfile(ctx.session.user.id, input),
    ),
})
