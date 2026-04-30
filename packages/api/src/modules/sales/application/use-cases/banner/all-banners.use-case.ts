import type { Database } from '@yukinu/db/drizzle'

import type { AllBannersDto } from '@/modules/sales/application/dtos/banner/all-banners.dto'
import type { BannerRepository } from '@/modules/sales/domain/repositories/banner.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class AllBannersUseCase extends AbstractUseCase<
  AllBannersDto.Input,
  AllBannersDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _bannerRepo: BannerRepository,
  ) {
    super()
  }

  execute(_input: AllBannersDto.Input): Promise<AllBannersDto.Output> {
    return this._bannerRepo.find()
  }
}
