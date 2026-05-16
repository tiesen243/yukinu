import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'
import { utapi } from '@yukinu/uploadthing'

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
    const [banner] = await this._bannerRepo.find(
      [{ id: input.id }],
      {},
      { limit: 1 },
    )
    if (!banner)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Banner with id ${input.id} not found`,
      })

    await this._bannerRepo.delete([{ id: input.id }])
    await utapi.deleteFiles(banner.url.split('/').pop() ?? '')
    return { id: input.id }
  }
}
