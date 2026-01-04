import type { ICategoryRepository } from '@/contracts/repositories/category.repository'
import type { IProductImageRepository } from '@/contracts/repositories/product-image.repository'
import type { IProductRepository } from '@/contracts/repositories/product.repository'
import type { IVariantRepository } from '@/contracts/repositories/variant.repository'
import type { IVendorRepository } from '@/contracts/repositories/vendor.repository'
import type { IProductService } from '@/contracts/services/product.service'
import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/product'

import { TRPCError } from '@trpc/server'
import { utapi } from '@yukinu/uploadthing'

import { MINMOD_ACCESS } from '@/trpc'

export class ProductService implements IProductService {
  constructor(
    private readonly _db: Database,
    private readonly _category: ICategoryRepository,
    private readonly _productImage: IProductImageRepository,
    private readonly _product: IProductRepository,
    private readonly _variant: IVariantRepository,
    private readonly _vendor: IVendorRepository,
  ) {}

  async all(input: Validators.AllInput): Promise<Validators.AllOutput> {
    const { search, isDeleted, categoryId, vendorId, page, limit } = input
    const offset = (page - 1) * limit

    const categoryQuery = categoryId
      ? this._category.find(categoryId)
      : Promise.resolve(null)
    const vendorQuery = vendorId
      ? this._vendor.find(vendorId)
      : Promise.resolve(null)

    const whereClauses = [
      {
        name: search ? `%${search}%` : 'not null',
        deletedAt: isDeleted
          ? ('not null' as unknown as Date)
          : ('null' as unknown as Date),
        ...(categoryId ? { categoryId } : {}),
        ...(vendorId ? { vendorId } : {}),
      },
    ]

    let orderBy = {}
    if (input.orderBy) {
      const [field, direction] = input.orderBy.split('_')
      if (field && direction) orderBy = { [field]: direction as 'asc' | 'desc' }
    }

    const [products, category, vendor, total] = await Promise.all([
      this._product.allWithRelations(whereClauses, orderBy, { limit, offset }),
      categoryQuery,
      vendorQuery,
      this._product.count(whereClauses),
    ])
    const totalPages = Math.ceil(total / limit)

    return {
      category: category ?? null,
      vendor: vendor ?? null,
      products: products,
      pagination: { total, page, limit, totalPages },
    }
  }

  async one(input: Validators.OneInput): Promise<Validators.OneOutput> {
    const product = await this._product.findWithRelations(input.id)
    if (!product)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
    return product
  }

  async create(
    input: Validators.CreateInput,
  ): Promise<Validators.CreateOutput> {
    const { attributes, images, variants, ...data } = input

    if (input.categoryId && !(await this._category.find(input.categoryId)))
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid category ID',
      })

    return this._db.transaction(async (tx) => {
      const productId = await this._product.create(data, tx)
      await this._productImage.createMany(
        images.map((url) => ({ productId, url })),
        tx,
      )
      await this._product.createAttributes(productId, attributes, tx)
      await this._variant.createWithOptions(productId, variants, tx)

      return { id: productId }
    })
  }

  async update(
    input: Validators.UpdateInput,
  ): Promise<Validators.UpdateOutput> {
    const { id, vendorId, attributes, images, ...data } = input

    const [target] = await this._product.all([
      {
        id: input.id,
        vendorId: vendorId === MINMOD_ACCESS ? undefined : vendorId,
      },
    ])
    if (!target)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with ID ${input.id} not found`,
      })

    if (input.categoryId && !(await this._category.find(input.categoryId)))
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid category ID',
      })

    return this._db.transaction(async (tx) => {
      await this._product.update(id, data, tx)

      const urls = await this._productImage.deleteMany([{ productId: id }], tx)
      await utapi.deleteFiles(urls.map((url) => url.split('/').pop() ?? ''))
      await this._productImage.createMany(
        images.map((url) => ({ productId: id, url })),
        tx,
      )

      await this._product.deleteAttributes(id, tx)
      await this._product.createAttributes(id, attributes, tx)

      return { id: input.id }
    })
  }

  async delete(
    input: Validators.DeleteInput,
  ): Promise<Validators.DeleteOutput> {
    const { id, vendorId } = input

    const [target] = await this._product.all([
      {
        id,
        vendorId: vendorId === MINMOD_ACCESS ? undefined : vendorId,
        deletedAt: 'not null' as unknown as Date,
      },
    ])
    if (!target)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with ID ${id} not found`,
      })

    await this._product.update(id, { deletedAt: new Date() })

    return { id }
  }

  async restore(
    input: Validators.RestoreInput,
  ): Promise<Validators.RestoreOutput> {
    const { id, vendorId } = input

    const [target] = await this._product.all([
      {
        id,
        vendorId: vendorId === MINMOD_ACCESS ? undefined : vendorId,
        deletedAt: 'null' as unknown as Date,
      },
    ])
    if (!target)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with ID ${id} not found`,
      })

    await this._product.update(id, { deletedAt: null })

    return { id }
  }

  async permanentlyDelete(
    input: Validators.PermanentlyDeleteInput,
  ): Promise<Validators.PermanentlyDeleteOutput> {
    const { id, vendorId } = input

    const [target] = await this._product.all([
      {
        id,
        vendorId: vendorId === MINMOD_ACCESS ? undefined : vendorId,
        deletedAt: 'not null' as unknown as Date,
      },
    ])
    if (!target)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with ID ${input.id} not found`,
      })

    return this._db.transaction(async (tx) => {
      const urls = await this._productImage.deleteMany([{ productId: id }], tx)
      await utapi.deleteFiles(urls.map((url) => url.split('/').pop() ?? ''))

      await this._product.delete(id, tx)

      return { id }
    })
  }
}
