import { and, eq, ilike, inArray, lte, sql } from '@yukinu/db'
import {
  categories,
  productImages,
  products,
  productVariantGroups,
  productVariants,
} from '@yukinu/db/schema/product'
import { vendors } from '@yukinu/db/schema/vendor'
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
      .where(
        and(
          ilike(productsView.name, `%${search}%`),
          lte(productsView.stock, 0),
        ),
      )
      .limit(limit)
      .offset(offset)
  }

  public async countAllView(search = '', tx = this._db): Promise<number> {
    return tx.$count(
      productsView,
      and(ilike(productsView.name, `%${search}%`), lte(productsView.stock, 0)),
    )
  }

  public async findWithRelations(
    productId: string,
    tx = this._db,
  ): ReturnType<IProductRepository['findWithRelations']> {
    const [product] = await tx
      .select({
        id: products.id,
        name: products.name,
        status: products.status,
        description: products.description,
        price: products.price,
        stock: products.stock,
        vendor: {
          id: vendors.id,
          name: vendors.name,
          imageUrl: vendors.imageUrl,
          website: vendors.website,
        },
        category: { id: categories.id, name: categories.name },
      })
      .from(products)
      .where(eq(products.id, productId))
      .innerJoin(vendors, eq(vendors.id, products.vendorId))
      .innerJoin(categories, eq(categories.id, products.categoryId))

    if (!product) return null

    const images = await tx
      .select({ url: productImages.url, alt: productImages.alt })
      .from(productImages)
      .where(eq(productImages.productId, productId))

    const variantGroups = await tx
      .select({
        id: productVariantGroups.id,
        name: productVariantGroups.name,
        variants: sql<
          IProductRepository.ProductVariant[]
        >`json_agg(jsonb_build_object(
      'id', ${productVariants.id}, 
      'name', ${productVariants.name}, 
      'stock', ${productVariants.stock},
      'extraPrice', ${productVariants.extraPrice}
      ))`.as('variants'),
      })
      .from(productVariantGroups)
      .innerJoin(
        productVariants,
        eq(productVariants.variantGroupId, productVariantGroups.id),
      )
      .groupBy(productVariantGroups.id)
      .having(eq(productVariantGroups.productId, productId))

    return { ...product, images, variantGroups }
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

  public async deleteImagesByProductId(
    productId: string,
    tx = this._db,
  ): Promise<void> {
    await tx.delete(productImages).where(eq(productImages.productId, productId))
  }

  public async createImages(
    images: IProductRepository.NewProductImage[],
    tx = this._db,
  ): Promise<void> {
    await tx.insert(productImages).values(images)
  }

  public async deleteVariantsByProductId(
    productId: string,
    tx = this._db,
  ): Promise<void> {
    const variantGroupIds = await tx
      .delete(productVariantGroups)
      .where(eq(productVariantGroups.productId, productId))
      .returning({ id: productVariantGroups.id })

    if (variantGroupIds.length > 0)
      await tx.delete(productVariants).where(
        inArray(
          productVariants.variantGroupId,
          variantGroupIds.map((vg) => vg.id),
        ),
      )
  }
}
