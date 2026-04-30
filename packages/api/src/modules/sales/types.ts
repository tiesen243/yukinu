import type { AllBannersUseCase } from '@/modules/sales/application/use-cases/banner/all-banners.use-case'
import type { CreateBannerUseCase } from '@/modules/sales/application/use-cases/banner/create-banner.use-case'
import type { DeleteBannerUseCase } from '@/modules/sales/application/use-cases/banner/delete-banner.use-case'

export interface UseCases {
  banner: {
    all: AllBannersUseCase
    create: CreateBannerUseCase
    delete: DeleteBannerUseCase
  }
}
