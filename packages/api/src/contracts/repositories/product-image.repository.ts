import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { productImages } from '@yukinu/db/schema'

export interface IProductImageRepository extends IBaseRepository<
  typeof productImages
> {}
