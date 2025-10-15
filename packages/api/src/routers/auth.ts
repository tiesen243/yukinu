import { AuthModel } from '@yukinu/validators/auth'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(AuthModel.registerBody)
    .mutation(({ input, ctx: { authService } }) => authService.register(input)),
})
