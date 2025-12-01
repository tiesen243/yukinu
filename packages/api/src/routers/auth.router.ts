import { AuthValidators } from '@yukinu/validators/auth'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/trpc'

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .meta({ message: 'Registration successful.' })
    .input(AuthValidators.registerInput)
    .output(AuthValidators.registerOutput)
    .mutation(({ ctx, input }) => ctx.services.auth.register(input)),

  verufyEmail: publicProcedure
    .meta({ message: 'Email verified successfully.' })
    .input(AuthValidators.verifyEmailInput)
    .output(AuthValidators.verifyEmailOutput)
    .mutation(({ ctx, input }) => ctx.services.auth.verifyEmail(input)),

  changePassword: protectedProcedure
    .meta({ message: 'Password changed successfully.' })
    .input(AuthValidators.changePasswordInput.omit({ userId: true }))
    .output(AuthValidators.changePasswordOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.auth.changePassword({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  forgotPassword: publicProcedure
    .meta({ message: 'Password reset email sent.' })
    .input(AuthValidators.forgotPasswordInput)
    .output(AuthValidators.forgotPasswordOutput)
    .mutation(({ ctx, input }) => ctx.services.auth.forgotPassword(input)),

  resetPassword: publicProcedure
    .meta({ message: 'Password has been reset.' })
    .input(AuthValidators.resetPasswordInput)
    .output(AuthValidators.resetPasswordOutput)
    .mutation(({ ctx, input }) => ctx.services.auth.resetPassword(input)),
})
