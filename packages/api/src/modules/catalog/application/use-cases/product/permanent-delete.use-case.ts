import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { OneProductDto } from '@/modules/catalog/application/dtos/product/one-product.dto'
import type { ProductImageRepository } from '@/modules/catalog/domain/repositories/product-image.repository'
import type { ProductRepository } from '@/modules/catalog/domain/repositories/product.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'
import { MINMOD_ACCESS } from '@/shared/constants'

export class PermanentDeleteProductUseCase extends AbstractUseCase<
  OneProductDto.Input,
  void
> {
  public constructor(
    private readonly _db: Database,
    private readonly _productImageRepo: ProductImageRepository,
    private readonly _productRepo: ProductRepository,
  ) {
    super()
  }

  public async execute(input: OneProductDto.Input): Promise<void> {
    const { id, vendorId } = input
    if (!vendorId)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Vendor ID is required to delete a product',
      })

    const [product] = await this._productRepo.find([
      {
        id,
        ...(vendorId === MINMOD_ACCESS ? {} : { vendorId }),
      },
    ])
    if (!product)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with ID ${input.id} not found`,
      })

    if (product.deletedAt === null)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Product with ID ${input.id} must be soft-deleted before permanent deletion`,
      })

    return this._db.transaction(async (tx) => {
      await this._productImageRepo.delete([{ productId: input.id }], tx)
      await this._productRepo.delete([{ id: input.id }], tx)
    })
  }
}
