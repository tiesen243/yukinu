import { AuthModel } from '@yukinu/validators/auth'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(AuthModel.registerBody)
    .mutation(({ ctx: { services }, input }) => services.auth.register(input)),

  changePassword: protectedProcedure
    .input(AuthModel.changePasswordBody)
    .mutation(({ ctx: { session, services }, input }) =>
      services.auth.changePassword(session.user.id, input),
    ),
})
