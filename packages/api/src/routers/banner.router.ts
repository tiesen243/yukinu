import * as Validators from '@yukinu/validators/general'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/trpc'

export const bannerRouter = createTRPCRouter({
  all: publicProcedure
    .meta({ message: 'Banners fetched successfully.' })
    .input(Validators.allBannersInput)
    .output(Validators.allBannersOutput)
    .query(({ ctx, input }) => ctx.services.banner.all(input)),

  create: protectedProcedure
    .meta({
      message: 'Banner created successfully.',
      role: ['admin', 'moderator'],
    })
    .input(Validators.createBannerInput)
    .output(Validators.createBannerOutput)
    .mutation(({ ctx, input }) => ctx.services.banner.create(input)),

  delete: protectedProcedure
    .meta({
      message: 'Banner deleted successfully.',
      role: ['admin', 'moderator'],
    })
    .input(Validators.deleteBannerInput)
    .output(Validators.deleteBannerOutput)
    .mutation(({ ctx, input }) => ctx.services.banner.delete(input)),
})
