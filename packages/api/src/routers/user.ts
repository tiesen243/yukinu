import { UserModel } from '@yukinu/validators/user'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(UserModel.registerBody)
    .mutation(async ({ input, ctx }) => ctx.userService.register(input)),
})
