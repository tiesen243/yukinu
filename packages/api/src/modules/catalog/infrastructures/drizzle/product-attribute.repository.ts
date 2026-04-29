import type { Database } from '@yukinu/db/drizzle'

import { productAttributes } from '@yukinu/db/schema'

import type { ProductAttributeRepository } from '@/modules/catalog/domain/repositories/product-attribute.repository'

import { ProductAttributeEntity } from '@/modules/catalog/domain/entities/product-attribute.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleProductAttributeRepository
  extends DrizzleRepository<ProductAttributeEntity, typeof productAttributes>
  implements ProductAttributeRepository
{
  public constructor(db: Database) {
    super(db, productAttributes, ['productId', 'attributeId'])
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof productAttributes>,
  ): ProductAttributeEntity {
    return new ProductAttributeEntity(row)
  }
}
