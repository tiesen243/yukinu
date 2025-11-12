import { ProfileModels } from '@yukinu/validators/profile'

import { createTRPCRouter, protectedProcedure } from '@/trpc'

export const profileRouter = createTRPCRouter({
  get: protectedProcedure
    .meta({ message: 'Profile fetched successfully' })
    .output(ProfileModels.oneOutput)
    .query(async ({ ctx }) => {
      const profile = await ctx.profileService.getByUserId(ctx.session.user)
      return {
        ...profile,
        username: ctx.session.user.username,
        email: ctx.session.user.email,
      }
    }),

  update: protectedProcedure
    .meta({ message: 'Profile updated successfully' })
    .input(ProfileModels.updateInput.omit({ id: true }))
    .output(ProfileModels.updateOutput)
    .mutation(({ ctx, input }) =>
      ctx.profileService.update({ ...input, id: ctx.session.user.id }),
    ),
})
