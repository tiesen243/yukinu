import { TRPCError } from '@trpc/server'

import type { ProductValidators } from '@yukinu/validators/product'

import type { IProductService } from '@/contracts/services/product.service'
import { BaseService } from '@/services/base.service'
import { MINMOD_ACCESS } from '@/trpc'

export class ProductService extends BaseService implements IProductService {
  async all(
    input: ProductValidators.AllInput,
  ): Promise<ProductValidators.AllOutput> {
    const { and, desc, eq, ilike, max, min, isNull, isNotNull } = this._orm
    const { productImages, productVariants, products } = this._schema
    const { search, categoryId, vendorId, isDeleted, page, limit } = input
    const offset = (page - 1) * limit

    const whereClause = []
    if (search) whereClause.push(ilike(products.name, `%${search}%`))
    if (categoryId) whereClause.push(eq(products.categoryId, categoryId))
    if (vendorId) whereClause.push(eq(products.vendorId, vendorId))
    if (isDeleted) whereClause.push(isNotNull(products.deletedAt))
    else whereClause.push(isNull(products.deletedAt))

    const [productsList, total] = await Promise.all([
      this._db
        .select({
          id: products.id,
          name: products.name,
          image: min(productImages.url),
          price: products.price,
          lowestVariantPrice: min(productVariants.price),
          highestVariantPrice: max(productVariants.price),
        })
        .from(products)
        .where(and(...whereClause))
        .limit(limit)
        .offset(offset)
        .leftJoin(productImages, eq(productImages.productId, products.id))
        .leftJoin(productVariants, eq(productVariants.productId, products.id))
        .orderBy(desc(products.createdAt))
        .groupBy(products.id),
      this._db.$count(products, and(...whereClause)),
    ])
    const totalPages = Math.ceil(total / limit)

    return {
      products: productsList,
      pagination: { total, page, limit, totalPages },
    }
  }

  async one(
    input: ProductValidators.OneInput,
  ): Promise<ProductValidators.OneOutput> {
    const { and, asc, eq, inArray, isNull } = this._orm
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

    const [product] = await this._db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        stock: products.stock,
        sold: products.sold,
        category: { id: categories.id, name: categories.name },
        vendor: { id: vendors.id, name: vendors.name, image: vendors.image },
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(vendors, eq(vendors.id, products.vendorId))
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .limit(1)
    if (!product)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with id ${id} not found`,
      })

    const [attrs, images, vrts, reviews] = await Promise.all([
      this._db
        .select({ name: attributes.name, value: productAttributes.value })
        .from(productAttributes)
        .where(eq(productAttributes.productId, id))
        .innerJoin(attributes, eq(attributes.id, productAttributes.attributeId))
        .orderBy(asc(attributes.name)),
      this._db
        .select({ id: productImages.id, url: productImages.url })
        .from(productImages)
        .where(eq(productImages.productId, id)),
      this._db
        .select({
          sku: productVariants.sku,
          price: productVariants.price,
          stock: productVariants.stock,
        })
        .from(productVariants)
        .where(eq(productVariants.productId, id)),
      this._db
        .select({
          id: productReviews.id,
          rating: productReviews.rating,
          comment: productReviews.comment,
          user: {
            id: users.id,
            username: users.username,
            image: users.image,
          },
          createdAt: productReviews.createdAt,
        })
        .from(productReviews)
        .where(eq(productReviews.productId, id))
        .innerJoin(users, eq(users.id, productReviews.userId)),
    ])

    const variantsList = await Promise.all(
      vrts.map(async (vrt) => {
        const ids = vrt.sku.split('-').map((v) => parseInt(v, 10))

        const options = await this._db
          .select({ name: variants.name, value: variantOptions.value })
          .from(variantOptions)
          .where(inArray(variantOptions.id, ids))
          .innerJoin(variants, eq(variants.id, variantOptions.variantId))
          .orderBy(asc(variantOptions.value))

        return { ...vrt, options }
      }),
    )

    return {
      ...product,
      images,
      attributes: attrs,
      variants: variantsList,
      reviews,
    }
  }

  async create(
    input: ProductValidators.CreateInput,
  ): Promise<ProductValidators.CreateOutput> {
    const { eq } = this._orm
    const {
      attributes,
      categories,
      productAttributes,
      productVariants,
      products,
      variantOptions,
      variants,
    } = this._schema
    const { attributes: attrs, variants: vrts, ...data } = input

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

      await Promise.all(
        attrs.map(async (attr) => {
          const [attribute = { id: '' }] = await tx
            .insert(attributes)
            .values({ name: attr.name })
            .onConflictDoUpdate({
              target: attributes.name,
              set: { name: attr.name },
            })
            .returning({ id: attributes.id })
          await tx.insert(productAttributes).values({
            productId: product.id,
            attributeId: attribute.id,
            value: attr.value,
          })
        }),
      )

      const results = await Promise.all(
        vrts.map(async (vrt) => {
          const [variant = { id: '' }] = await tx
            .insert(variants)
            .values({ name: vrt.name })
            .onConflictDoUpdate({
              target: variants.name,
              set: { name: vrt.name },
            })
            .returning({ id: variants.id })
          const options = await tx
            .insert(variantOptions)
            .values(
              vrt.options.map((option) => ({
                variantId: variant.id,
                value: option,
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
      const skus = skuCombinations.map((comb) => comb.join('-'))
      await tx
        .insert(productVariants)
        .values(skus.map((sku) => ({ productId: product.id, sku })))

      return { id: product.id }
    })
  }

  async update(
    input: ProductValidators.UpdateInput,
  ): Promise<ProductValidators.UpdateOutput> {
    const { and, eq } = this._orm
    const { attributes, products, productAttributes } = this._schema
    const { id, vendorId, attributes: attrs = [], ...data } = input

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

      await Promise.all(
        attrs.map(async (attr) => {
          const [attribute = { id: '' }] = await tx
            .insert(attributes)
            .values({ name: attr.name })
            .onConflictDoUpdate({
              target: attributes.name,
              set: { name: attr.name },
            })
            .returning({ id: attributes.id })

          await tx
            .insert(productAttributes)
            .values({
              productId: id,
              attributeId: attribute.id,
              value: attr.value,
            })
            .onConflictDoUpdate({
              target: [
                productAttributes.productId,
                productAttributes.attributeId,
              ],
              set: { value: attr.value },
            })
        }),
      )

      return { id }
    })
  }

  async delete(
    input: ProductValidators.DeleteInput,
  ): Promise<ProductValidators.DeleteOutput> {
    const { and, eq } = this._orm
    const { products } = this._schema
    const { id, vendorId } = input

    const [deleted] = await this._db
      .update(products)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(products.id, id),
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

    const [restored] = await this._db
      .update(products)
      .set({ deletedAt: null })
      .where(
        vendorId === MINMOD_ACCESS
          ? eq(products.id, id)
          : and(eq(products.id, id), eq(products.vendorId, vendorId)),
      )
      .returning({ id: products.id })

    if (!restored)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with id ${id} not found`,
      })

    return { id }
  }

  private _cartesianProduct(arrays: string[][]): string[][] {
    return arrays.reduce<string[][]>(
      (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
      [[]],
    )
  }
}
