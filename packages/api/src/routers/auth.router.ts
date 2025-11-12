import { AuthModels } from '@yukinu/validators/auth'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/trpc'

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .meta({ message: 'Login successfully' })
    .input(AuthModels.loginInput)
    .output(AuthModels.loginOutput)
    .mutation(({ ctx, input }) =>
      ctx.authService.login(input, ctx.headers, ctx.resHeaders),
    ),

  logout: protectedProcedure
    .meta({ message: 'Logout successfully' })
    .mutation(({ ctx }) => ctx.authService.logout(ctx.headers, ctx.resHeaders)),

  register: publicProcedure
    .meta({ message: 'User registered successfully' })
    .input(AuthModels.registerInput)
    .output(AuthModels.registerOutput)
    .mutation(({ ctx, input }) => ctx.authService.register(input)),

  changePassword: protectedProcedure
    .meta({ message: 'Password changed successfully' })
    .input(AuthModels.changePasswordInput.omit({ userId: true }))
    .mutation(({ ctx, input }) =>
      ctx.authService.changePassword({ ...input, userId: ctx.session.user.id }),
    ),
})
