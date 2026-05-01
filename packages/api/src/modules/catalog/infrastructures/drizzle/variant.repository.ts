import type { Database } from '@yukinu/db/drizzle'

import { productVariants, variantOptions, variants } from '@yukinu/db/schema'
import { createId } from '@yukinu/lib/create-id'

import type { ProductEntity } from '@/modules/catalog/domain/entities/product.entity'
import type { VariantRepository } from '@/modules/catalog/domain/repositories/variant.repository'

import { VariantEntity } from '@/modules/catalog/domain/entities/variant.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleVariantRepository
  extends DrizzleRepository<VariantEntity, typeof variants>
  implements VariantRepository
{
  public constructor(db: Database) {
    super(db, variants, 'id')
  }

  async createWithOptions(
    productId: ProductEntity['id'],
    vrts: { name: string; options: string[] }[],
    tx = this._db,
  ): Promise<void> {
    if (vrts.length === 0) return

    const results = await Promise.all(
      vrts.map(async (vrt) => {
        const [variant = { id: '' }] = await tx
          .insert(variants)
          .values({ id: createId(), name: vrt.name.toLowerCase() })
          .onConflictDoUpdate({
            target: variants.name,
            set: { name: vrt.name.toLowerCase() },
          })
          .returning({ id: variants.id })

        const options = await tx
          .insert(variantOptions)
          .values(
            vrt.options.map((option) => ({
              variantId: variant.id,
              value: option.toLowerCase(),
            })),
          )
          .onConflictDoUpdate({
            target: [variantOptions.variantId, variantOptions.value],
            set: { variantId: variant.id },
          })
          .returning({ id: variantOptions.id })

        return { id: variant.id, options: options.map((o) => o.id) }
      }),
    )

    const skuCombinations = this._cartesianProduct(
      results.map((r) => r.options.map(String)),
    )
    if (skuCombinations.length > 0)
      await tx.insert(productVariants).values(
        skuCombinations.map((skus) => ({
          id: createId(),
          productId,
          sku: `${productId.slice(-4)}-${skus.join('-')}`,
        })),
      )
  }

  private _cartesianProduct(arrays: string[][]): string[][] {
    let result: string[][] = [[]]
    for (const curr of arrays)
      result = result.flatMap((a) => curr.map((b) => [...a, b]))
    return result
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof variants>,
  ): VariantEntity {
    return new VariantEntity(row)
  }
}
