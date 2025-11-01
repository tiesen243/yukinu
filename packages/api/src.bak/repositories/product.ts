import type { products } from '@yukinu/db/schema/product'

import type { IBaseRepository } from './base'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IProductRepository extends IBaseRepository<typeof products> {}
