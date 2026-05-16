import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { SaveProductDto } from '@/modules/catalog/application/dtos/product/save-product.dto'
import type { CategoryRepository } from '@/modules/catalog/domain/repositories/category.repository'
import type { ProductAttributeRepository } from '@/modules/catalog/domain/repositories/product-attribute.repository'
import type { ProductImageRepository } from '@/modules/catalog/domain/repositories/product-image.repository'
import type { ProductRepository } from '@/modules/catalog/domain/repositories/product.repository'

import { ProductImageEntity } from '@/modules/catalog/domain/entities/product-image.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'
import { MINMOD_ACCESS } from '@/shared/constants'

export class UpdateProductUseCase extends AbstractUseCase<
  Omit<SaveProductDto.Input, 'variants'>,
  SaveProductDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _categoryRepo: CategoryRepository,
    private readonly _productAttributeRepo: ProductAttributeRepository,
    private readonly _productImageRepo: ProductImageRepository,
    private readonly _productRepo: ProductRepository,
  ) {
    super()
  }

  async execute(
    input: Omit<SaveProductDto.Input, 'variants'>,
  ): Promise<SaveProductDto.Output> {
    const { id, vendorId, attributes, images, ...data } = input
    if (!id)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Product ID is required for update',
      })

    const [target] = await this._productRepo.find([
      {
        id: input.id,
        ...(vendorId === MINMOD_ACCESS ? {} : { vendorId }),
      },
    ])
    if (!target)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with ID ${input.id} not found`,
      })

    if (
      input.categoryId &&
      // oxlint-disable-next-line unicorn/no-await-expression-member
      (
        await this._categoryRepo.find(
          [{ id: input.categoryId }],
          {},
          { limit: 1 },
        )
      ).length === 0
    )
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid category ID',
      })

    return this._db.transaction(async (tx) => {
      const updatedProduct = target.clone(data)
      await this._productRepo.save(updatedProduct, tx)

      await this._productImageRepo.delete([{ productId: id }], tx)
      // await utapi.deleteFiles(urls.map((url) => url.split('/').pop() ?? ''))

      const newImages = images.map(
        (url) => new ProductImageEntity({ productId: id, url }),
      )
      await this._productImageRepo.saveMany(newImages, tx)

      await this._productAttributeRepo.delete([{ productId: id }], tx)
      await this._productAttributeRepo.createAttributes(id, attributes, tx)

      return { id }
    })
  }
}
