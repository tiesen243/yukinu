import { and, ilike, lte } from '@yukinu/db'
import {
  productImages,
  products,
  productVariantGroups,
  productVariants,
} from '@yukinu/db/schema/product'
import { productsView } from '@yukinu/db/schema/view'

import type { IProductRepository } from '@/types'
import { BaseRepository } from '@/repositories/base.repository'

export class ProductRepository
  extends BaseRepository<typeof products>
  implements IProductRepository
{
  protected override _table = products

  public async findAllView(
    search = '',
    limit = 10,
    offset = 0,
    tx = this._db,
  ): Promise<IProductRepository.ProductsView[]> {
    return tx
      .select()
      .from(productsView)
      .where(ilike(productsView.name, `%${search}%`))
      .limit(limit)
      .offset(offset)
  }

  public async countAllView(search = '', tx = this._db): Promise<number> {
    return tx.$count(
      productsView,
      and(ilike(productsView.name, `%${search}%`), lte(productsView.stock, 0)),
    )
  }

  public async createVariants(
    variantGroups: (IProductRepository.NewProductVariantGroup & {
      variants: Omit<IProductRepository.NewProductVariant, 'variantGroupId'>[]
    })[],
    tx = this._db,
  ) {
    for (const { code, name, productId, variants } of variantGroups) {
      const [newGroup] = await tx
        .insert(productVariantGroups)
        .values({
          code,
          name,
          productId,
        })
        .returning({ id: productVariantGroups.id })
      if (!newGroup) continue

      await tx.insert(productVariants).values(
        variants.map((variant) => ({
          variantGroupId: newGroup.id,
          code: variant.code,
          name: variant.name,
          extraPrice: variant.extraPrice ?? '0',
        })),
      )
    }
  }

  public async createImages(
    images: IProductRepository.NewProductImage[],
    tx = this._db,
  ): Promise<void> {
    await tx.insert(productImages).values(images)
  }
}
