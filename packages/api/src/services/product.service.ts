import { TRPCError } from '@trpc/server'

import type { ProductValidators } from '@yukinu/validators/product'

import type { IProductService } from '@/contracts/services/product.service'
import { BaseService } from '@/services/base.service'
import { MINMOD_ACCESS } from '@/trpc'

export class ProductService extends BaseService implements IProductService {
  all(
    _input: ProductValidators.AllInput,
  ): Promise<ProductValidators.AllOutput> {
    throw new TRPCError({
      code: 'NOT_IMPLEMENTED',
      message: 'Get all products not implemented yet',
    })
  }

  async one(
    input: ProductValidators.OneInput,
  ): Promise<ProductValidators.OneOutput> {
    const { and, asc, eq, isNull } = this._orm
    const { attributes, products, productAttributes, productImages, vendors } =
      this._schema
    const { id } = input

    const [product] = await this._db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        vendor: { id: vendors.id, name: vendors.name, image: vendors.image },
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(vendors, eq(vendors.id, products.vendorId))
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .limit(1)
    if (!product)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with id ${id} not found`,
      })

    const [attrs, images] = await Promise.all([
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
    ])

    // @ts-expect-error -- Need to fix later
    return { ...product, attributes: attrs, images }
  }

  create(
    input: ProductValidators.CreateInput,
  ): Promise<ProductValidators.CreateOutput> {
    const { attributes, products, productAttributes } = this._schema
    const { vendorId, attributes: attrs = [], ...data } = input

    return this._db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values({ vendorId, ...data })
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
            .onConflictDoNothing()
            .returning({ id: attributes.id })
          await tx.insert(productAttributes).values({
            productId: product.id,
            attributeId: attribute.id,
            value: attr.value,
          })
        }),
      )

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
}
