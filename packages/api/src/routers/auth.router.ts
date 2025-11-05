import { AuthValidator } from '@yukinu/validators/auth'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/trpc'

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .meta({ message: 'User registered successfully' })
    .input(AuthValidator.registerBody)
    .mutation(({ ctx, input }) => ctx.authService.register(input)),

  changePassword: protectedProcedure
    .meta({ message: 'Password changed successfully' })
    .input(AuthValidator.changePasswordBody)
    .mutation(({ ctx, input }) =>
      ctx.authService.changePassword(ctx.session.user.id, input),
    ),
})
