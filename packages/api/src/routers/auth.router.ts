import { AuthValidator } from '@yukinu/validators/auth'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(AuthValidator.registerBody)
    .mutation(({ ctx, input }) => ctx.authService.register(input)),

  changePassword: protectedProcedure
    .input(AuthValidator.changePasswordBody)
    .mutation(({ ctx, input }) =>
      ctx.authService.changePassword(ctx.session.user.id, input),
    ),
})
