import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/sales/types'

import { AllBannersDto } from '@/modules/sales/application/dtos/banner/all-banners.dto'
import { CreateBannerDto } from '@/modules/sales/application/dtos/banner/create-banner.dto'
import { DeleteBannerDto } from '@/modules/sales/application/dtos/banner/delete-banner.dto'
import { protectedProcedure, publicProcedure } from '@/trpc'

export const bannerRouter = ({ banner }: UseCases) =>
  ({
    all: publicProcedure
      .input(AllBannersDto.input)
      .output(AllBannersDto.output)
      .query(() => banner.all.execute()),

    create: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(CreateBannerDto.input)
      .output(CreateBannerDto.output)
      .mutation(({ input }) => banner.create.execute(input)),

    delete: protectedProcedure
      .meta({ role: ['admin', 'moderator'] })
      .input(DeleteBannerDto.input)
      .output(DeleteBannerDto.output)
      .mutation(({ input }) => banner.delete.execute(input)),
  }) satisfies TRPCRouterRecord
