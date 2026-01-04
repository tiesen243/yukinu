import type { IProductRepository } from '@/contracts/repositories/product.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'
import type {
  ProductSchema,
  AllOutput,
  OneOutput,
  ProductVariantSchema,
} from '@yukinu/validators/product'
import type { VendorSchema } from '@yukinu/validators/vendor'

import { BaseRepository } from '@/repositories/base.repository'

export class ProductRepository
  extends BaseRepository<typeof Schema.products>
  implements IProductRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.products)
  }

  allWithRelations(
    criterias: Partial<ProductSchema>[] = [],
    orderBy: Partial<Record<keyof ProductSchema, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx = this._db,
  ): Promise<AllOutput['products']> {
    const { sql, eq, min } = this._orm
    const {
      products,
      categories,
      productImages,
      productReviews,
      productVariants,
    } = this._schema

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

  async findWithRelations(
    id: ProductSchema['id'],
    tx = this._db,
  ): Promise<OneOutput | null> {
    const { and, eq, isNull, sql } = this._orm
    const {
      attributes,
      categories,
      productAttributes,
      productImages,
      productReviews,
      productVariants,
      products,
      users,
      variantOptions,
      variants,
      vendors,
    } = this._schema

    const imagesAgg = sql<OneOutput['images']>`coalesce(
      jsonb_agg(distinct jsonb_build_object(
        'id', ${productImages.id}, 
        'url', ${productImages.url}
      )) filter (where ${productImages.productId} is not null),
      '[]'::jsonb
    )`.as('images')

    const attributesAgg = sql<OneOutput['attributes']>`coalesce(
      jsonb_agg(distinct jsonb_build_object(
        'name', ${attributes.name}, 'value', ${productAttributes.value}
      )) filter (where ${productAttributes.productId} is not null),
      '[]'::jsonb
    )`.as('attributes')

    const reviewsAgg = sql<OneOutput['reviews']>`coalesce(
      jsonb_agg(distinct jsonb_build_object(
        'id', ${productReviews.id},
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
      .limit(1)
      .groupBy(products.id, categories.id, vendors.id)

    if (!product) return null

    const variantOptionsAgg = sql<
      OneOutput['variants'][number]['options']
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

  createAttributes(
    productId: ProductSchema['id'],
    attrs: { name: string; value: string }[],
    tx = this._db,
  ): Promise<void[]> {
    const { productAttributes, attributes } = this._schema

    return Promise.all(
      attrs.map(async (attr) => {
        const [attribute = { id: '' }] = await tx
          .insert(attributes)
          .values({ name: attr.name.toLowerCase() })
          .onConflictDoUpdate({
            target: attributes.name,
            set: { name: attr.name.toLowerCase() },
          })
          .returning({ id: attributes.id })
        await tx.insert(productAttributes).values({
          productId: productId,
          attributeId: attribute.id,
          value: attr.value,
        })
      }),
    )
  }

  deleteAttributes(
    productId: ProductSchema['id'],
    tx = this._db,
  ): Promise<unknown> {
    const { eq } = this._orm
    const { productAttributes } = this._schema

    return tx
      .delete(productAttributes)
      .where(eq(productAttributes.productId, productId))
  }

  async findVariant(
    productVariantId: ProductVariantSchema['id'],
    vendorId?: VendorSchema['id'],
    tx = this._db,
  ): Promise<Pick<ProductVariantSchema, 'id'> | null> {
    const { and, eq } = this._orm
    const { productVariants, products } = this._schema

    const [variant] = await tx
      .select({ id: productVariants.id })
      .from(productVariants)
      .innerJoin(products, eq(products.id, productVariants.productId))
      .where(
        and(
          eq(productVariants.id, productVariantId),
          vendorId ? eq(products.vendorId, vendorId) : undefined,
        ),
      )
      .limit(1)

    return variant ?? null
  }

  async updateVariant(
    id: ProductVariantSchema['id'],
    data: Partial<ProductVariantSchema>,
    tx = this._db,
  ): Promise<ProductVariantSchema['id']> {
    const { eq } = this._orm
    const { productVariants } = this._schema

    const [result] = await tx
      .update(productVariants)
      .set(data)
      .where(eq(productVariants.id, id))
      .returning({ id: productVariants.id })

    return result ? result.id : ''
  }

  deleteVariant(
    variantId: ProductVariantSchema['id'],
    tx = this._db,
  ): Promise<unknown> {
    const { eq } = this._orm
    const { productVariants } = this._schema

    return tx.delete(productVariants).where(eq(productVariants.id, variantId))
  }

  deleteVariants(
    productId: ProductSchema['id'],
    tx = this._db,
  ): Promise<unknown> {
    const { eq } = this._orm
    const { productVariants } = this._schema

    return tx
      .delete(productVariants)
      .where(eq(productVariants.productId, productId))
  }
}
