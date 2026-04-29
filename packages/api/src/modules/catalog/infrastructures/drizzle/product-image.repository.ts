import type { Database } from '@yukinu/db/drizzle'

import { productImages } from '@yukinu/db/schema'

import type { ProductImageRepository } from '@/modules/catalog/domain/repositories/product-image.repository'

import { ProductImageEntity } from '@/modules/catalog/domain/entities/product-image.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleProductImageRepository
  extends DrizzleRepository<ProductImageEntity, typeof productImages>
  implements ProductImageRepository
{
  public constructor(db: Database) {
    super(db, productImages, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof productImages>,
  ): ProductImageEntity {
    return new ProductImageEntity(row)
  }
}
