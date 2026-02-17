import type { productImages } from '@yukinu/db/schema'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface IProductImageRepository extends IBaseRepository<
  typeof productImages
> {}
