import type { Database } from '@yukinu/db/drizzle'

import { and, eq, isNull, min, sql } from '@yukinu/db/drizzle'
import {
  products,
  attributes,
  categories,
  productAttributes,
  productImages,
  productReviews,
  productVariants,
  users,
  variantOptions,
  variants,
  vendors,
} from '@yukinu/db/schema'

import type { OneProductDto } from '@/modules/catalog/application/dtos/product/one-product.dto'
import type { ProductRepository } from '@/modules/catalog/domain/repositories/product.repository'
import type { AllProductsDto } from '@/modules/catalog/types'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

import { ProductEntity } from '@/modules/catalog/domain/entities/product.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleProductRepository
  extends DrizzleRepository<ProductEntity, typeof products>
  implements ProductRepository
{
  public constructor(db: Database) {
    super(db, products, 'id')
  }

  public findWithRelations(
    criterias: AbstractRepository.Criteria<ProductEntity>[] = [],
    orderBy: Partial<Record<keyof ProductEntity, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx: Database = this._db,
  ): Promise<AllProductsDto.Output['products']> {
    const whereClauses = this._buildCriteria(criterias)
    const orderByClauses = this._buildOrderBy(orderBy)

    const query = tx
      .select({
        id: products.id,
        name: products.name,
        category: categories.name,
        image: min(productImages.url),
        price: products.price,
        stock: products.stock,
        sold: products.sold,
        rating: sql<string>`COALESCE(ROUND(AVG(${productReviews.rating}), 2), 0)`,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        deletedAt: products.deletedAt,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .leftJoin(productReviews, eq(productReviews.productId, products.id))
      .leftJoin(productVariants, eq(productVariants.productId, products.id))
      .groupBy(products.id, categories.id)
      .$dynamic()

    if (whereClauses) query.where(whereClauses)
    if (orderByClauses) query.orderBy(orderByClauses)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    return query
  }

  public async findWithDetails(
    id: ProductEntity['id'],
    tx: Database = this._db,
  ): Promise<OneProductDto.Output | null> {
    const imagesAgg = sql<OneProductDto.Output['images']>`coalesce(
      jsonb_agg(distinct jsonb_build_object(
        'id', ${productImages.id}, 
        'url', ${productImages.url}
      )) filter (where ${productImages.productId} is not null),
      '[]'::jsonb
    )`.as('images')

    const attributesAgg = sql<OneProductDto.Output['attributes']>`coalesce(
      jsonb_agg(distinct jsonb_build_object(
        'name', ${attributes.name}, 'value', ${productAttributes.value}
      )) filter (where ${productAttributes.productId} is not null),
      '[]'::jsonb
    )`.as('attributes')

    const reviewsAgg = sql<OneProductDto.Output['reviews']>`coalesce(
      jsonb_agg(distinct jsonb_build_object(
        'rating', ${productReviews.rating},
        'comment', ${productReviews.comment},
        'user', jsonb_build_object(
          'id', ${users.id},
          'username', ${users.username},
          'image', ${users.image}
        ),
        'createdAt', ${productReviews.createdAt}
      )) filter (where ${productReviews.productId} is not null),
      '[]'::jsonb
    )`.as('reviews')

    const [product] = await tx
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        stock: products.stock,
        sold: products.sold,
        category: { id: categories.id, name: categories.name },
        images: imagesAgg,
        attributes: attributesAgg,
        vendor: {
          id: vendors.id,
          name: vendors.name,
          image: vendors.image,
          address: vendors.address,
        },
        reviews: reviewsAgg,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .leftJoin(productAttributes, eq(productAttributes.productId, products.id))
      .leftJoin(attributes, eq(attributes.id, productAttributes.attributeId))
      .leftJoin(productReviews, eq(productReviews.productId, products.id))
      .leftJoin(users, eq(users.id, productReviews.userId))
      .leftJoin(vendors, eq(vendors.id, products.vendorId))
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .groupBy(products.id, categories.id, vendors.id)
      .limit(1)
    if (!product) return null

    const variantOptionsAgg = sql<
      OneProductDto.Output['variants'][number]['options']
    >`coalesce(
      jsonb_agg(distinct jsonb_build_object(
        'name', ${variants.name}, 
        'value', ${variantOptions.value}
      )) filter (where ${variantOptions.variantId} is not null),
      '[]'::jsonb
    )`.as('options')

    const vrts = await this._db
      .select({
        id: productVariants.id,
        sku: productVariants.sku,
        price: productVariants.price,
        stock: productVariants.stock,
        options: variantOptionsAgg,
      })
      .from(productVariants)
      .leftJoin(
        variantOptions,
        sql`${variantOptions.id} = ANY(string_to_array(substring(${productVariants.sku} from 6), '-')::int[])`,
      )
      .leftJoin(variants, eq(variants.id, variantOptions.variantId))
      .where(eq(productVariants.productId, id))
      .groupBy(productVariants.id)

    return { ...product, variants: vrts }
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof products>,
  ): ProductEntity {
    return new ProductEntity(row)
  }
}
