import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { DeleteVariantDto } from '@/modules/catalog/application/dtos/variant/delete-variant.dto'
import type { ProductVariantRepository } from '@/modules/catalog/domain/repositories/product-variant.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class DeleteVariantUseCase extends AbstractUseCase<
  DeleteVariantDto.Input,
  DeleteVariantDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _productVariantRepo: ProductVariantRepository,
  ) {
    super()
  }

  public async execute(
    input: DeleteVariantDto.Input,
  ): Promise<DeleteVariantDto.Output> {
    const [variant] = await this._productVariantRepo.find([input])
    if (!variant)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Variant with ID ${input.id} not found`,
      })

    await this._productVariantRepo.delete([input])
  }
}
