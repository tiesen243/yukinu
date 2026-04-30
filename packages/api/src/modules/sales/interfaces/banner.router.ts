import type { TRPCRouterRecord } from '@trpc/server'

import type { UseCases } from '@/modules/sales/types'

import { AllBannersDto } from '@/modules/sales/application/dtos/banner/all-banners.dto'
import { CreateBannerDto } from '@/modules/sales/application/dtos/banner/create-banner.dto'
import { DeleteBannerDto } from '@/modules/sales/application/dtos/banner/delete-banner.dto'
import { protectedProcedure } from '@/trpc'

export const createBannerRouter = ({ banner }: UseCases) =>
  ({
    all: protectedProcedure
      .input(AllBannersDto.input)
      .output(AllBannersDto.output)
      .query(() => banner.all.execute()),

    create: protectedProcedure
      .input(CreateBannerDto.input)
      .output(CreateBannerDto.output)
      .mutation(({ input }) => banner.create.execute(input)),

    delete: protectedProcedure
      .input(DeleteBannerDto.input)
      .output(DeleteBannerDto.output)
      .mutation(({ input }) => banner.delete.execute(input)),
  }) satisfies TRPCRouterRecord
