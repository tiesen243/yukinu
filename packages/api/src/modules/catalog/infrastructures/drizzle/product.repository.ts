import type { Database } from '@yukinu/db/drizzle'

import { products } from '@yukinu/db/schema'

import type { ProductRepository } from '@/modules/catalog/domain/repositories/product.repository'

import { ProductEntity } from '@/modules/catalog/domain/entities/product.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleProductRepository
  extends DrizzleRepository<ProductEntity, typeof products>
  implements ProductRepository
{
  public constructor(db: Database) {
    super(db, products, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof products>,
  ): ProductEntity {
    return new ProductEntity(row)
  }
}