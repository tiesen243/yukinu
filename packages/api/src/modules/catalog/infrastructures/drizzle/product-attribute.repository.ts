import type { Database } from '@yukinu/db/drizzle'

import { attributes, productAttributes } from '@yukinu/db/schema'
import { createId } from '@yukinu/lib/create-id'

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

  createAttributes(
    productId: ProductAttributeEntity['id'],
    attrs: { name: string; value: string }[],
    tx = this._db,
  ): Promise<unknown> {
    return Promise.all(
      attrs.map(async (attr) => {
        const [attribute = { id: '' }] = await tx
          .insert(attributes)
          .values({ id: createId(), name: attr.name.toLowerCase() })
          .onConflictDoUpdate({
            target: attributes.name,
            set: { name: attr.name.toLowerCase() },
          })
          .returning({ id: attributes.id })

        await tx.insert(productAttributes).values({
          productId,
          attributeId: attribute.id,
          value: attr.value,
        })
      }),
    )
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof productAttributes>,
  ): ProductAttributeEntity {
    return new ProductAttributeEntity(row)
  }
}
