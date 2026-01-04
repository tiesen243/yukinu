import type { IVariantRepository } from '@/contracts/repositories/variant.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'
import type { ProductSchema, CreateInput } from '@yukinu/validators/product'

import { BaseRepository } from '@/repositories/base.repository'

export class VariantRepository
  extends BaseRepository<typeof Schema.variants>
  implements IVariantRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.variants)
  }

  async createWithOptions(
    productId: ProductSchema['id'],
    vrts: CreateInput['variants'],
    tx = this._db,
  ): Promise<ProductSchema['id']> {
    const { productVariants, variants, variantOptions } = this._schema

    if (vrts.length === 0) return productId

    const results = await Promise.all(
      vrts.map(async (vrt) => {
        const [variant = { id: '' }] = await tx
          .insert(variants)
          .values({ name: vrt.name.toLowerCase() })
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
          productId,
          sku: `${productId.slice(-4)}-${skus.join('-')}`,
        })),
      )

    return productId
  }

  private _cartesianProduct(arrays: string[][]): string[][] {
    return arrays.reduce<string[][]>(
      (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
      [[]],
    )
  }
}
