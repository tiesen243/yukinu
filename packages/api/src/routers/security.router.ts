import * as Validators from '@yukinu/validators/auth'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const securityRouter = createTRPCRouter({
  allSessions: protectedProcedure
    .meta({ message: 'All sessions fetched successfully.' })
    .output(Validators.allSessionsOutput)
    .query(({ ctx }) =>
      ctx.services.security.allSessions({ userId: ctx.session.userId }),
    ),

  deleteSession: protectedProcedure
    .meta({ message: 'Session deleted successfully.' })
    .input(Validators.deleteSessionInput.omit({ userId: true }))
    .output(Validators.deleteSessionOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.security.deleteSession({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  changeUsername: protectedProcedure
    .meta({ message: 'Username changed successfully.' })
    .input(Validators.changeUsernameInput.omit({ id: true }))
    .output(Validators.changeUsernameOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.security.changeUsername({
        ...input,
        id: ctx.session.userId,
      }),
    ),

  changePassword: protectedProcedure
    .meta({ message: 'Password changed successfully.' })
    .input(Validators.changePasswordInput)
    .output(Validators.changePasswordOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.security.changePassword({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  deleteAccount: protectedProcedure
    .meta({ message: 'Account deleted successfully.' })
    .input(Validators.deleteAccountInput.omit({ userId: true }))
    .output(Validators.deleteAccountOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.security.deleteAccount({
        ...input,
        userId: ctx.session.userId,
      }),
    ),
})
