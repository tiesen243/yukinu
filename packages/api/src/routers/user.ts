import { UserModel } from '@yukinu/validators/user'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  profile: protectedProcedure.query(({ ctx }) =>
    ctx.userService.getProfile(ctx.session.user.id),
  ),

  register: publicProcedure
    .input(UserModel.registerBody)
    .mutation(({ input, ctx }) => ctx.userService.register(input)),
})
