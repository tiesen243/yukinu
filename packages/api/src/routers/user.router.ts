import * as Validators from '@yukinu/validators/user'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const userRouter = createTRPCRouter({
  all: protectedProcedure
    .meta({
      message: 'Users fetched successfully',
      role: ['admin'],
    })
    .input(Validators.allUsersInput)
    .output(Validators.allUsersOutput)
    .query(({ ctx, input }) => ctx.services.user.all(input)),

  one: protectedProcedure
    .meta({
      message: 'User fetched successfully',
      role: ['admin'],
    })
    .input(Validators.oneUserInput)
    .output(Validators.oneUserOutput)
    .query(({ ctx, input }) => ctx.services.user.one(input)),

  update: protectedProcedure
    .meta({
      message: 'User updated successfully',
      role: ['admin'],
    })
    .input(Validators.updateUserInput.omit({ userId: true }))
    .output(Validators.updateUserOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.user.update({ ...input, userId: ctx.session.userId }),
    ),

  delete: protectedProcedure
    .meta({
      message: 'User deleted successfully',
      role: ['admin'],
    })
    .input(Validators.deleteUserInput.omit({ userId: true }))
    .output(Validators.deleteUserOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.user.delete({ ...input, userId: ctx.session.userId }),
    ),

  restore: protectedProcedure
    .meta({
      message: 'User restored successfully',
      role: ['admin'],
    })
    .input(Validators.restoreUserInput.omit({ userId: true }))
    .output(Validators.restoreUserOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.user.restore({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  permanentlyDelete: protectedProcedure
    .meta({
      message: 'User permanently deleted successfully',
      role: ['admin'],
    })
    .input(Validators.permanentlyDeleteUserInput.omit({ userId: true }))
    .output(Validators.permanentlyDeleteUserOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.user.permanentlyDelete({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  profile: protectedProcedure
    .meta({ message: 'User profile fetched successfully' })
    .input(Validators.profileInput.omit({ id: true }))
    .output(Validators.profileOutput)
    .query(({ ctx }) => ctx.services.user.profile({ id: ctx.session.userId })),

  updateProfile: protectedProcedure
    .meta({ message: 'User profile updated successfully' })
    .input(Validators.updateProfileInput.omit({ id: true }))
    .output(Validators.updateProfileOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.user.updateProfile({
        ...input,
        id: ctx.session.userId,
      }),
    ),
})
