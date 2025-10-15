import type { products } from '@yukinu/db/schema/product'

import type { IProductRepository } from './product'
import { BaseRepository } from './base.repository'

export class ProductRepository
  extends BaseRepository<typeof products>
  implements IProductRepository {}
