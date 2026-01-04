import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { banners } from '@yukinu/db/schema'

export interface IBannerRepository extends IBaseRepository<typeof banners> {}
