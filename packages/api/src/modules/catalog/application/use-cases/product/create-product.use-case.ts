import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { SaveProductDto } from '@/modules/catalog/application/dtos/product/save-product.dto'
import type { CategoryRepository } from '@/modules/catalog/domain/repositories/category.repository'
import type { ProductAttributeRepository } from '@/modules/catalog/domain/repositories/product-attribute.repository'
import type { ProductImageRepository } from '@/modules/catalog/domain/repositories/product-image.repository'
import type { ProductRepository } from '@/modules/catalog/domain/repositories/product.repository'
import type { VariantRepository } from '@/modules/catalog/domain/repositories/variant.repository'

import { ProductImageEntity } from '@/modules/catalog/domain/entities/product-image.entity'
import { ProductEntity } from '@/modules/catalog/domain/entities/product.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class CreateProductUseCase extends AbstractUseCase<
  SaveProductDto.Input,
  SaveProductDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _categoryRepo: CategoryRepository,
    private readonly _productAttributeRepo: ProductAttributeRepository,
    private readonly _productImageRepo: ProductImageRepository,
    private readonly _productRepo: ProductRepository,
    private readonly _variantRepo: VariantRepository,
  ) {
    super()
  }

  async execute(input: SaveProductDto.Input): Promise<SaveProductDto.Output> {
    const { attributes, images, variants, ...data } = input

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
      const newProduct = new ProductEntity({ ...data, sold: 0 })
      await this._productRepo.save(newProduct, tx)

      const newImages = images.map(
        (url) => new ProductImageEntity({ productId: newProduct.id, url }),
      )
      await this._productImageRepo.saveMany(newImages, tx)

      await this._productAttributeRepo.createAttributes(
        newProduct.id,
        attributes,
        tx,
      )
      await this._variantRepo.createWithOptions(newProduct.id, variants, tx)

      return { id: newProduct.id }
    })
  }
}
