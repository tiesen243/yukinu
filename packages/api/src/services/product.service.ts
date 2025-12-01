import { TRPCError } from '@trpc/server'

import type { ProductValidators } from '@yukinu/validators/product'

import type { IProductService } from '@/contracts/services/product.service'
import { BaseService } from '@/services/base.service'

export class ProductService extends BaseService implements IProductService {
  async all(
    input: ProductValidators.AllInput,
  ): Promise<ProductValidators.AllOutput> {
    const { and, eq, ilike, min, max, isNull, isNotNull } = this._orm
    const { products, productImages, productVariants, productVariantOptions } =
      this._schema
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
          price: products.price,
          image: min(productImages.url),
          lowestVariantPrice: min(productVariantOptions.extraPrice),
          highestVariantPrice: max(productVariantOptions.extraPrice),
        })
        .from(products)
        .where(and(...whereClause))
        .offset(offset)
        .limit(limit)
        .leftJoin(productImages, eq(productImages.productId, products.id))
        .leftJoin(productVariants, eq(productVariants.productId, products.id))
        .leftJoin(
          productVariantOptions,
          eq(productVariantOptions.variantId, productVariants.id),
        )
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
    const { and, eq, isNull, sql } = this._orm
    const {
      categories,
      products,
      productImages,
      productVariants,
      productVariantOptions,
      productReviews,
      users,
      vendors,
    } = this._schema
    const { id } = input

    const [product] = await this._db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        sku: products.sku,
        category: { id: categories.id, name: categories.name },
        vendor: {
          id: vendors.id,
          name: vendors.name,
          image: vendors.image,
          createdAt: vendors.createdAt,
        },
      })
      .from(products)
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .limit(1)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .innerJoin(vendors, eq(vendors.id, products.vendorId))

    if (!product)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Product not found or deleted',
      })

    const [images, variants, reviews] = await Promise.all([
      this._db
        .select({ id: productImages.id, url: productImages.url })
        .from(productImages)
        .where(eq(productImages.productId, id)),
      this._db
        .select({
          id: productVariants.id,
          name: productVariants.name,
          options: sql<
            ProductValidators.OneOutput['variants'][number]['options']
          >`json_agg(json_build_object(
              'id', ${productVariantOptions.id}, 
              'value', ${productVariantOptions.value}, 
              'stock', ${productVariantOptions.stock},
              'extraPrice', ${productVariantOptions.extraPrice}
            ))`.as('options'),
        })
        .from(productVariants)
        .where(eq(productVariants.productId, id))
        .innerJoin(
          productVariantOptions,
          eq(productVariantOptions.variantId, productVariants.id),
        )
        .groupBy(productVariants.id),
      this._db
        .select({
          id: productReviews.id,
          rating: productReviews.rating,
          comment: productReviews.comment,
          user: { id: users.id, username: users.username, image: users.image },
          createdAt: productReviews.createdAt,
        })
        .from(productReviews)
        .where(eq(productReviews.productId, id))
        .innerJoin(users, eq(users.id, productReviews.userId)),
    ])

    return { ...product, images, variants, reviews }
  }

  create(
    input: ProductValidators.CreateInput,
  ): Promise<ProductValidators.CreateOutput> {
    const { products, productImages, productVariants, productVariantOptions } =
      this._schema
    const { images, variants, ...data } = input

    return this._db.transaction(async (tx) => {
      // 1. Insert product
      const [newProduct] = await tx
        .insert(products)
        .values(data)
        .returning({ id: products.id })
      if (!newProduct)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create product',
        })

      // 2. Insert images
      const imageInserts =
        images.length > 0
          ? tx
              .insert(productImages)
              .values(images.map((url) => ({ url, productId: newProduct.id })))
          : Promise.resolve()

      // 3. Insert variants and options
      const variantInserts = variants.map(async (variant) => {
        const { name, options } = variant
        const [newVariant] = await tx
          .insert(productVariants)
          .values({ name, productId: newProduct.id })
          .returning({ id: productVariants.id })
        if (!newVariant)
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create product variant',
          })

        if (options.length > 0) {
          await tx.insert(productVariantOptions).values(
            options.map((option) => ({
              ...option,
              variantId: newVariant.id,
            })),
          )
        }
      })

      await Promise.all([imageInserts, ...variantInserts])
      return newProduct
    })
  }

  async update(
    input: ProductValidators.UpdateInput,
  ): Promise<ProductValidators.UpdateOutput> {
    const { eq } = this._orm
    const { products, productImages, productVariants, productVariantOptions } =
      this._schema
    const { id, images, variants, ...data } = input

    return this._db.transaction(async (tx) => {
      // 1. Update product data
      const [result] = await tx
        .update(products)
        .set({ ...data })
        .where(eq(products.id, id))
        .returning({ id: products.id })
      if (!result)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update product',
        })

      // 2. Delete and re-insert images if provided
      if (images.length > 0) {
        await tx.delete(productImages).where(eq(productImages.productId, id))
        await tx
          .insert(productImages)
          .values(images.map((url) => ({ url, productId: id })))
      }

      // 3. Delete and re-insert variants and options if provided
      if (variants.length > 0) {
        await tx
          .delete(productVariants)
          .where(eq(productVariants.productId, id))

        await Promise.all(
          variants.map(async (variant) => {
            const { name, options } = variant
            const [newVariant] = await tx
              .insert(productVariants)
              .values({ name, productId: id })
              .returning({ id: productVariants.id })
            if (!newVariant)
              throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to create product variant',
              })

            if (options.length > 0) {
              await tx.insert(productVariantOptions).values(
                options.map((option) => ({
                  ...option,
                  variantId: newVariant.id,
                })),
              )
            }
          }),
        )
      }

      return { id }
    })
  }

  async delete(
    input: ProductValidators.DeleteInput,
  ): Promise<ProductValidators.DeleteOutput> {
    const { eq } = this._orm
    const { products } = this._schema
    const { id } = input

    await this._db
      .update(products)
      .set({ deletedAt: new Date() })
      .where(eq(products.id, id))

    return { id }
  }

  async restore(
    input: ProductValidators.RestoreInput,
  ): Promise<ProductValidators.RestoreOutput> {
    const { eq } = this._orm
    const { products } = this._schema
    const { id } = input

    await this._db
      .update(products)
      .set({ deletedAt: null })
      .where(eq(products.id, id))

    return { id }
  }
}
