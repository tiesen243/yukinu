import type { TRPCRouterRecord } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { UseCases } from '@/modules/sales/types'

import { AllBannersUseCase } from '@/modules/sales/application/use-cases/banner/all-banners.use-case'
import { CreateBannerUseCase } from '@/modules/sales/application/use-cases/banner/create-banner.use-case'
import { DeleteBannerUseCase } from '@/modules/sales/application/use-cases/banner/delete-banner.use-case'
import { DrizzleBannerRepository } from '@/modules/sales/infrastructures/drizzle/banner.repository'
import { createBannerRouter } from '@/modules/sales/interfaces/banner.router'

export const createSalesModule = (db: Database) => {
  const bannerRepo = new DrizzleBannerRepository(db)
  const useCases = {
    banner: {
      all: new AllBannersUseCase(db, bannerRepo),
      create: new CreateBannerUseCase(db, bannerRepo),
      delete: new DeleteBannerUseCase(db, bannerRepo),
    },
  } satisfies UseCases

  return {
    useCases,
    router: {
      banner: createBannerRouter(useCases),
    } satisfies TRPCRouterRecord,
  }
}
