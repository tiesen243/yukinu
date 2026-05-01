import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { OneProductDto } from '@/modules/catalog/application/dtos/product/one-product.dto'
import type { ProductRepository } from '@/modules/catalog/domain/repositories/product.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'
import { MINMOD_ACCESS } from '@/shared/constants'

export class DeleteProductUseCase extends AbstractUseCase<
  OneProductDto.Input,
  void
> {
  public constructor(
    private readonly _db: Database,
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

    if (product.deletedAt)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Product with ID ${input.id} is already deleted`,
      })

    const deletedProduct = product.clone({ deletedAt: new Date() })
    await this._productRepo.save(deletedProduct)
  }
}
