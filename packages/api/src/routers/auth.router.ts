import { AuthModels } from '@yukinu/validators/auth'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/trpc'

export const authRouter = createTRPCRouter({
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
