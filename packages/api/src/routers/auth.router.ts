import { AuthValidators } from '@yukinu/validators/auth'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/trpc'

export const authRouter = createTRPCRouter({
  getCurrentUser: protectedProcedure
    .meta({ message: 'Current user fetched successfully.' })
    .query(({ ctx }) => ctx.services.auth.getCurrentUser(ctx.session.userId)),

  register: publicProcedure
    .meta({ message: 'Registration successful.' })
    .input(AuthValidators.registerInput)
    .output(AuthValidators.registerOutput)
    .mutation(({ ctx, input }) => ctx.services.auth.register(input)),

  verifyEmail: publicProcedure
    .meta({ message: 'Email verified successfully.' })
    .input(AuthValidators.verifyEmailInput)
    .output(AuthValidators.verifyEmailOutput)
    .mutation(({ ctx, input }) => ctx.services.auth.verifyEmail(input)),

  allSessions: protectedProcedure
    .meta({ message: 'All sessions fetched successfully.' })
    .input(AuthValidators.allSessionsInput.omit({ userId: true }))
    .output(AuthValidators.allSessionsOutput)
    .query(({ ctx, input }) =>
      ctx.services.auth.allSessions({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  deleteSession: protectedProcedure
    .meta({ message: 'Session deleted successfully.' })
    .input(AuthValidators.deleteSessionInput.omit({ userId: true }))
    .output(AuthValidators.deleteSessionOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.auth.deleteSession({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  changeUsername: protectedProcedure
    .meta({ message: 'Username changed successfully.' })
    .input(AuthValidators.changeUsernameInput.omit({ userId: true }))
    .output(AuthValidators.changeUsernameOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.auth.changeUsername({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  deleteAccount: protectedProcedure
    .meta({ message: 'Account deleted successfully.' })
    .input(AuthValidators.deleteAccountInput.omit({ userId: true }))
    .output(AuthValidators.deleteAccountOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.auth.deleteAccount({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

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
