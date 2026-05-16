import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { UpdateVariantDto } from '@/modules/catalog/application/dtos/variant/update-variant.dto'
import type { ProductVariantRepository } from '@/modules/catalog/domain/repositories/product-variant.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class UpdateVariantUseCase extends AbstractUseCase<
  UpdateVariantDto.Input,
  UpdateVariantDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _productVariantRepo: ProductVariantRepository,
  ) {
    super()
  }

  public async execute(
    input: UpdateVariantDto.Input,
  ): Promise<UpdateVariantDto.Output> {
    const { id, ...data } = input

    const [variant] = await this._productVariantRepo.find(
      [{ id }],
      {},
      { limit: 1 },
    )
    if (!variant)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Variant with ID ${id} not found`,
      })

    const updatedVariant = variant.clone(data)
    await this._productVariantRepo.save(updatedVariant)
  }
}
