import type { Database } from '@yukinu/db/drizzle'

import type { CreateBannerDto } from '@/modules/sales/application/dtos/banner/create-banner.dto'
import type { BannerRepository } from '@/modules/sales/domain/repositories/banner.repository'

import { BannerEntity } from '@/modules/sales/domain/entities/banner.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class CreateBannerUseCase extends AbstractUseCase<
  CreateBannerDto.Input,
  CreateBannerDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _bannerRepo: BannerRepository,
  ) {
    super()
  }

  async execute(input: CreateBannerDto.Input): Promise<CreateBannerDto.Output> {
    const newBanner = new BannerEntity(input)
    await this._bannerRepo.save(newBanner)
    return { id: newBanner.id }
  }
}
