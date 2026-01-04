import type { IBannerRepository } from '@/contracts/repositories/banner.repository'
import type { IBannerService } from '@/contracts/services/banner.service'
import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/general'

export class BannerService implements IBannerService {
  constructor(
    private readonly _db: Database,
    private readonly _banner: IBannerRepository,
  ) {}

  all(
    _input: Validators.AllBannersInput,
  ): Promise<Validators.AllBannersOutput> {
    return this._banner.all()
  }

  async create(
    input: Validators.CreateBannerInput,
  ): Promise<Validators.CreateBannerOutput> {
    const newBannerId = await this._banner.create(input)
    return { id: newBannerId }
  }

  async delete(
    input: Validators.DeleteBannerInput,
  ): Promise<Validators.DeleteBannerOutput> {
    const deletedBannerId = await this._banner.delete(input.id)
    return { id: deletedBannerId }
  }
}
