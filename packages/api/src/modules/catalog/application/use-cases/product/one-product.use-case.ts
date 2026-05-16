import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { OneProductDto } from '@/modules/catalog/application/dtos/product/one-product.dto'
import type { ProductRepository } from '@/modules/catalog/domain/repositories/product.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class OneProductUseCase extends AbstractUseCase<
  OneProductDto.Input,
  OneProductDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _productRepo: ProductRepository,
  ) {
    super()
  }

  public async execute(
    input: OneProductDto.Input,
  ): Promise<OneProductDto.Output> {
    const product = await this._productRepo.findWithDetails(input.id)
    if (!product)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })

    return product
  }
}
