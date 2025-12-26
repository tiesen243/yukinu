import type { IProductService } from '@/contracts/services/product.service'
import type { Database } from '@yukinu/db'
import type { ProductValidators } from '@yukinu/validators/product'

import { TRPCError } from '@trpc/server'
import { vendors } from '@yukinu/db/schema'

import { BaseService } from '@/services/base.service'
import { MINMOD_ACCESS } from '@/trpc'

export class ProductService extends BaseService implements IProductService {
  async all(
    input: ProductValidators.AllInput,
  ): Promise<ProductValidators.AllOutput> {
    const {
      and,
      asc,
      desc,
      or,
      eq,
      inArray,
      ilike,
      min,
      isNull,
      isNotNull,
      sql,
    } = this._orm
    const {
      categories,
      productImages,
      productReviews,
      productVariants,
      products,
    } = this._schema
    const { search, categoryId, vendorId, isDeleted, page, limit, orderBy } =
      input
    const offset = (page - 1) * limit

    const whereClauses = []
    if (search) whereClauses.push(ilike(products.name, `%${search}%`))
    if (categoryId)
      whereClauses.push(
        or(
          eq(products.categoryId, categoryId),
          inArray(
            products.categoryId,
            this._db
              .select({ id: categories.id })
              .from(categories)
              .where(eq(categories.parentId, categoryId)),
          ),
        ),
      )
    if (vendorId) whereClauses.push(eq(products.vendorId, vendorId))
    if (isDeleted) whereClauses.push(isNotNull(products.deletedAt))
    else whereClauses.push(isNull(products.deletedAt))
    const whereClause =
      whereClauses.length > 0 ? and(...whereClauses) : undefined

    const productsQuery = this._db
      .select({
        id: products.id,
        name: products.name,
        category: categories.name,
        image: min(productImages.url),
        price: products.price,
        sold: products.sold,
        rating: sql<string>`COALESCE(ROUND(AVG(${productReviews.rating}), 2), 0)`,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        deletedAt: products.deletedAt,
      })
      .from(products)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .leftJoin(productReviews, eq(productReviews.productId, products.id))
      .leftJoin(productVariants, eq(productVariants.productId, products.id))
      .groupBy(products.id, categories.id)

    if (orderBy) {
      const [field, direction] = orderBy.split('_') as [
        ProductValidators.OrderByField,
        ProductValidators.OrderByDirection,
      ]
      const directionSql = direction === 'asc' ? asc : desc
      productsQuery.orderBy(directionSql(products[field]))
    }

    const categoryQuery = categoryId
      ? this._db
          .select({
            id: categories.id,
            name: categories.name,
            description: categories.description,
            image: categories.image,
          })
          .from(categories)
          .where(eq(categories.id, categoryId))
          .limit(1)
      : Promise.resolve([])
    const vendorQuery = vendorId
      ? this._db
          .select({
            id: vendors.id,
            name: vendors.name,
            image: vendors.image,
            description: vendors.address,
          })
          .from(vendors)
          .where(eq(vendors.id, vendorId))
          .limit(1)
      : Promise.resolve([])

    const [productsList, [category], [vendor], total] = await Promise.all([
      productsQuery,
      categoryQuery,
      vendorQuery,
      this._db.$count(products, whereClause),
    ])
    const totalPages = Math.ceil(total / limit)

    return {
      category: category ?? null,
      vendor: vendor ?? null,
      products: productsList,
      pagination: { total, page, limit, totalPages },
    }
  }

  async one(
    input: ProductValidators.OneInput,
  ): Promise<ProductValidators.OneOutput> {
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
    const { id } = input

    const imagesAgg = sql<ProductValidators.OneOutput['images']>`coalesce(
      jsonb_agg(distinct jsonb_build_object(
        'id', ${productImages.id}, 
        'url', ${productImages.url}
      )) filter (where ${productImages.productId} is not null),
      '[]'::jsonb
    )`.as('images')

    const attributesAgg = sql<
      ProductValidators.OneOutput['attributes']
    >`coalesce(
      jsonb_agg(distinct jsonb_build_object(
        'name', ${attributes.name}, 'value', ${productAttributes.value}
      )) filter (where ${productAttributes.productId} is not null),
      '[]'::jsonb
    )`.as('attributes')

    const reviewsAgg = sql<ProductValidators.OneOutput['reviews']>`coalesce(
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

    const [product] = await this._db
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

    if (!product)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with id ${id} not found`,
      })

    const variantOptionsAgg = sql<
      ProductValidators.OneOutput['variants'][number]['options']
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

  async create(
    input: ProductValidators.CreateInput,
  ): Promise<ProductValidators.CreateOutput> {
    const { eq } = this._orm
    const {
      attributes,
      categories,
      productAttributes,
      productImages,
      products,
    } = this._schema
    const { attributes: attrs, images, variants: vrts, ...data } = input

    if (data.categoryId) {
      const [category] = await this._db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.id, data.categoryId))
        .limit(1)
      if (!category)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Category with id ${data.categoryId} does not exist`,
        })
    }

    return this._db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values(data)
        .returning({ id: products.id })
      if (!product)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create product',
        })

      await tx
        .insert(productImages)
        .values(images.map((url) => ({ productId: product.id, url })))

      await Promise.all(
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
            productId: product.id,
            attributeId: attribute.id,
            value: attr.value.toLowerCase(),
          })
        }),
      )

      return this._createVariants(product.id, vrts, tx)
    })
  }

  async update(
    input: ProductValidators.UpdateInput,
  ): Promise<ProductValidators.UpdateOutput> {
    const { and, eq } = this._orm
    const {
      attributes,
      categories,
      productAttributes,
      productImages,
      products,
    } = this._schema
    const { id, vendorId, attributes: attrs, images, ...data } = input
    if (!vendorId)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Vendor ID is required for updating a product',
      })

    const [productToUpdate] = await this._db
      .select({ categoryId: products.categoryId })
      .from(products)
      .where(eq(products.id, id))
      .limit(1)
    if (!productToUpdate)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with id ${id} not found`,
      })

    if (data.categoryId && data.categoryId !== productToUpdate.categoryId) {
      const [category] = await this._db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.id, data.categoryId))
        .limit(1)
      if (!category)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Category with id ${data.categoryId} does not exist`,
        })
    }

    const [product] = await this._db
      .select({ id: products.id })
      .from(products)
      .where(
        vendorId === MINMOD_ACCESS
          ? eq(products.id, id)
          : and(eq(products.id, id), eq(products.vendorId, vendorId)),
      )
      .limit(1)
    if (!product)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with id ${id} not found`,
      })

    return this._db.transaction(async (tx) => {
      const [updated] = await tx
        .update(products)
        .set(data)
        .where(eq(products.id, id))
        .returning({ id: products.id })
      if (!updated)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to update product with id ${id}`,
        })

      await tx.delete(productImages).where(eq(productImages.productId, id))
      await tx
        .insert(productImages)
        .values(images.map((url) => ({ productId: id, url })))

      await tx
        .delete(productAttributes)
        .where(eq(productAttributes.productId, id))
      await Promise.all(
        attrs.map(async (attr) => {
          const [attribute = { id: '' }] = await tx
            .insert(attributes)
            .values({ name: attr.name.toLowerCase() })
            .onConflictDoUpdate({
              target: attributes.name,
              set: { name: attr.name.toLowerCase() },
            })
            .returning({ id: attributes.id })

          await tx
            .insert(productAttributes)
            .values({
              productId: id,
              attributeId: attribute.id,
              value: attr.value.toLowerCase(),
            })
            .onConflictDoUpdate({
              target: [
                productAttributes.productId,
                productAttributes.attributeId,
              ],
              set: { value: attr.value.toLowerCase() },
            })
        }),
      )

      return { id }
    })
  }

  async delete(
    input: ProductValidators.DeleteInput,
  ): Promise<ProductValidators.DeleteOutput> {
    const { and, eq, isNull } = this._orm
    const { products } = this._schema
    const { id, vendorId } = input

    const [deleted] = await this._db
      .update(products)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(products.id, id),
          isNull(products.deletedAt),
          vendorId === MINMOD_ACCESS
            ? undefined
            : eq(products.vendorId, vendorId),
        ),
      )
      .returning({ id: products.id })

    if (!deleted)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with id ${id} not found`,
      })

    return { id }
  }

  async restore(
    input: ProductValidators.RestoreInput,
  ): Promise<ProductValidators.RestoreOutput> {
    const { and, eq } = this._orm
    const { products } = this._schema
    const { id, vendorId } = input

    const [targetProduct] = await this._db
      .select({ deletedAt: products.deletedAt })
      .from(products)
      .where(
        and(
          eq(products.id, id),
          vendorId === MINMOD_ACCESS
            ? undefined
            : eq(products.vendorId, vendorId),
        ),
      )
      .limit(1)

    if (!targetProduct)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with id ${id} not found`,
      })

    if (targetProduct.deletedAt === null)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Product with id ${id} is not deleted`,
      })

    await this._db
      .update(products)
      .set({ deletedAt: null })
      .where(eq(products.id, id))

    return { id }
  }

  async permanentlyDelete(
    input: ProductValidators.PermanentlyDeleteInput,
  ): Promise<ProductValidators.PermanentlyDeleteOutput> {
    const { and, eq } = this._orm
    const { products } = this._schema
    const { id, vendorId } = input

    const [product] = await this._db
      .select({ id: products.id, deletedAt: products.deletedAt })
      .from(products)
      .where(
        and(
          eq(products.id, id),
          vendorId === MINMOD_ACCESS
            ? undefined
            : eq(products.vendorId, vendorId),
        ),
      )
      .limit(1)
    if (!product)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with id ${id} not found`,
      })

    if (product.deletedAt === null)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Product with id ${id} must be soft-deleted before permanent deletion`,
      })

    await this._db.delete(products).where(this._orm.eq(products.id, id))

    return { id }
  }

  async recreateVariant(
    input: ProductValidators.RecreateVariantInput,
  ): Promise<ProductValidators.RecreateVariantOutput> {
    const { and, eq } = this._orm
    const { productVariants, products } = this._schema
    const { id, vendorId, variants: vrts } = input
    if (!vendorId)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Vendor ID is required for recreating product variants',
      })

    const [product] = await this._db
      .select({ id: products.id })
      .from(products)
      .where(
        and(
          eq(products.id, id),
          vendorId === MINMOD_ACCESS
            ? undefined
            : eq(products.vendorId, vendorId),
        ),
      )
      .limit(1)
    if (!product)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with id ${id} not found`,
      })

    return this._db.transaction(async (tx) => {
      await tx.delete(productVariants).where(eq(productVariants.productId, id))
      return this._createVariants(product.id, vrts, tx)
    })
  }

  async updateVariant(
    input: ProductValidators.UpdateVariantInput,
  ): Promise<ProductValidators.UpdateVariantOutput> {
    const { and, eq } = this._orm
    const { productVariants, products } = this._schema
    const { id, vendorId, ...data } = input

    const [variant] = await this._db
      .select({ id: productVariants.id })
      .from(productVariants)
      .innerJoin(products, eq(products.id, productVariants.productId))
      .where(
        and(
          eq(productVariants.id, id),
          vendorId === MINMOD_ACCESS
            ? undefined
            : eq(products.vendorId, vendorId),
        ),
      )
      .limit(1)
    if (!variant)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product variant with id ${id} not found`,
      })

    const [updated] = await this._db
      .update(productVariants)
      .set(data)
      .where(eq(productVariants.id, id))
      .returning({ id: productVariants.id })
    if (!updated)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product variant with id ${id} not found`,
      })

    return { id }
  }

  async deleteVariant(
    input: ProductValidators.DeleteVariantInput,
  ): Promise<ProductValidators.DeleteVariantOutput> {
    const { and, eq } = this._orm
    const { productVariants, products } = this._schema
    const { id, vendorId } = input

    const [variant] = await this._db
      .select({ id: productVariants.id })
      .from(productVariants)
      .innerJoin(products, eq(products.id, productVariants.productId))
      .where(
        and(
          eq(productVariants.id, id),
          vendorId === MINMOD_ACCESS
            ? undefined
            : eq(products.vendorId, vendorId),
        ),
      )
      .limit(1)
    if (!variant)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product variant with id ${id} not found`,
      })

    const [deleted] = await this._db
      .delete(productVariants)
      .where(eq(productVariants.id, id))
      .returning({ id: productVariants.id })
    if (!deleted)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product variant with id ${id} not found`,
      })

    return { id }
  }

  private _cartesianProduct(arrays: string[][]): string[][] {
    return arrays.reduce<string[][]>(
      (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
      [[]],
    )
  }

  private async _createVariants(
    productId: string,
    vrts: ProductValidators.CreateInput['variants'],
    tx: Database,
  ) {
    const { productVariants, variants, variantOptions } = this._schema

    if (vrts.length === 0) return { id: productId }

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

    return { id: productId }
  }
}
