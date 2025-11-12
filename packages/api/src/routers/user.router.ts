import { UserModels } from '@yukinu/validators/user'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const userRouter = createTRPCRouter({
  all: protectedProcedure
    .meta({
      message: 'Fetched users successfully',
      roles: ['admin', 'moderator'],
    })
    .input(UserModels.allInput)
    .output(UserModels.allOutput)
    .query(({ ctx, input }) => ctx.userService.all(input)),

  update: protectedProcedure
    .meta({
      message: 'User updated successfully',
      roles: ['admin', 'moderator'],
    })
    .input(UserModels.updateInput)
    .output(UserModels.updateOutput)
    .mutation(({ ctx, input }) =>
      ctx.userService.update(input, ctx.session.user),
    ),

  delete: protectedProcedure
    .meta({
      message: 'User deleted successfully',
      roles: ['admin', 'moderator'],
    })
    .input(UserModels.deleteInput)
    .output(UserModels.deleteOutput)
    .mutation(({ ctx, input }) =>
      ctx.userService.delete(input, ctx.session.user),
    ),
})
