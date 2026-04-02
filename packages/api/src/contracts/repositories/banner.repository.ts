import type { banners } from '@yukinu/db/schema'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface IBannerRepository extends IBaseRepository<typeof banners> {}
