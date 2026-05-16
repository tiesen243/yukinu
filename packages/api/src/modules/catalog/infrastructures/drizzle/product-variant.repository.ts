import type { Database } from '@yukinu/db/drizzle'

import { productVariants } from '@yukinu/db/schema'

import type { ProductVariantRepository } from '@/modules/catalog/domain/repositories/product-variant.repository'

import { ProductVariantEntity } from '@/modules/catalog/domain/entities/product-variant.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleProductVariantRepository
  extends DrizzleRepository<ProductVariantEntity, typeof productVariants>
  implements ProductVariantRepository
{
  public constructor(db: Database) {
    super(db, productVariants, 'id')
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof productVariants>,
  ): ProductVariantEntity {
    return new ProductVariantEntity(row)
  }
}
