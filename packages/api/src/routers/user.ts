import { UserModel } from '@yukinu/validators/user'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(UserModel.registerBody)
    .mutation(({ input, ctx }) => ctx.userService.register(input)),
})
