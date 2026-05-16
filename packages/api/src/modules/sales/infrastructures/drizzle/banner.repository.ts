import type { Database } from '@yukinu/db/drizzle'

import { banners } from '@yukinu/db/schema'

import type { BannerRepository } from '@/modules/sales/domain/repositories/banner.repository'

import { BannerEntity } from '@/modules/sales/domain/entities/banner.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleBannerRepository
  extends DrizzleRepository<BannerEntity, typeof banners>
  implements BannerRepository
{
  public constructor(db: Database) {
    super(db, banners, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof banners>,
  ): BannerEntity {
    return new BannerEntity(row)
  }
}
