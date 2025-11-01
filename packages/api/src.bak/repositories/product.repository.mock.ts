import type { products } from '@yukinu/db/schema/product'

import type { IProductRepository } from './product'
import { BaseRepositoryMock } from './base.repository.mock'

export class ProductRepositoryMock
  extends BaseRepositoryMock<typeof products>
  implements IProductRepository {}
