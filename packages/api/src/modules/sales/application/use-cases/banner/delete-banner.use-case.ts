import type { Database } from '@yukinu/db/drizzle'

import type { DeleteBannerDto } from '@/modules/sales/application/dtos/banner/delete-banner.dto'
import type { BannerRepository } from '@/modules/sales/domain/repositories/banner.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class DeleteBannerUseCase extends AbstractUseCase<
  DeleteBannerDto.Input,
  DeleteBannerDto.Output
> {
  constructor(
    private readonly _db: Database,
    private readonly _bannerRepo: BannerRepository,
  ) {
    super()
  }
  async execute(input: DeleteBannerDto.Input): Promise<DeleteBannerDto.Output> {
    await this._bannerRepo.delete([{ id: input.id }])
    return { id: input.id }
  }
}
