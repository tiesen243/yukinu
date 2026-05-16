import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { RecreateVariantDto } from '@/modules/catalog/application/dtos/variant/recreate-variant.dto'
import type { ProductVariantRepository } from '@/modules/catalog/domain/repositories/product-variant.repository'
import type { ProductRepository } from '@/modules/catalog/domain/repositories/product.repository'
import type { VariantRepository } from '@/modules/catalog/domain/repositories/variant.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'
import { MINMOD_ACCESS } from '@/shared/constants'

export class RecreateVariantUseCase extends AbstractUseCase<
  RecreateVariantDto.Input,
  RecreateVariantDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _productVariantRepo: ProductVariantRepository,
    private readonly _productRepo: ProductRepository,
    private readonly _variantRepo: VariantRepository,
  ) {
    super()
  }

  public async execute(
    input: RecreateVariantDto.Input,
  ): Promise<RecreateVariantDto.Output> {
    const { id, vendorId, variants } = input

    const [product] = await this._productRepo.find([
      {
        id,
        deletedAt: 'null' as unknown as Date,
        ...(vendorId === MINMOD_ACCESS ? {} : { vendorId }),
      },
    ])
    if (!product)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Product with ID ${id} not found`,
      })

    return this._db.transaction(async (tx) => {
      await this._productVariantRepo.delete([{ productId: product.id }], tx)
      await this._variantRepo.createWithOptions(product.id, variants, tx)
    })
  }
}
