import * as Validators from '@yukinu/validators/auth'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/trpc'

export const authRouter = createTRPCRouter({
  currentUser: protectedProcedure
    .meta({ message: 'Current user fetched successfully.' })
    .query(({ ctx }) => ctx.services.auth.getCurrentUser(ctx.session.userId)),

  register: publicProcedure
    .meta({ message: 'Registration successful.' })
    .input(Validators.registerInput)
    .output(Validators.registerOutput)
    .mutation(({ ctx, input }) => ctx.services.auth.register(input)),

  verifyEmail: publicProcedure
    .meta({ message: 'Email verified successfully.' })
    .input(Validators.verifyEmailInput)
    .output(Validators.verifyEmailOutput)
    .mutation(({ ctx, input }) => ctx.services.auth.verifyEmail(input)),

  forgotPassword: publicProcedure
    .meta({ message: 'Password reset email sent.' })
    .input(Validators.forgotPasswordInput)
    .output(Validators.forgotPasswordOutput)
    .mutation(({ ctx, input }) => ctx.services.auth.forgotPassword(input)),

  resetPassword: publicProcedure
    .meta({ message: 'Password has been reset.' })
    .input(Validators.resetPasswordInput)
    .output(Validators.resetPasswordOutput)
    .mutation(({ ctx, input }) => ctx.services.auth.resetPassword(input)),
})
