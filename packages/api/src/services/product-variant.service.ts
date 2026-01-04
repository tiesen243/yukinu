import type { IProductRepository } from '@/contracts/repositories/product.repository'
import type { IVariantRepository } from '@/contracts/repositories/variant.repository'
import type { IProductVariantService } from '@/contracts/services/product-variant.service'
import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/product'

import { TRPCError } from '@trpc/server'

import { MINMOD_ACCESS } from '@/trpc'

export class ProductVariantService implements IProductVariantService {
  constructor(
    private readonly _db: Database,
    private readonly _product: IProductRepository,
    private readonly _variant: IVariantRepository,
  ) {}

  async recreate(
    input: Validators.RecreateVariantInput,
  ): Promise<Validators.RecreateVariantOutput> {
    const { id, vendorId, variants } = input

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

    return this._db.transaction(async (tx) => {
      await this._product.deleteVariants(target.id, tx)
      await this._variant.createWithOptions(target.id, variants, tx)

      return { id: target.id }
    })
  }

  async update(
    input: Validators.UpdateVariantInput,
  ): Promise<Validators.UpdateVariantOutput> {
    const { id, vendorId, ...data } = input

    const variant = await this._product.findVariant(
      id,
      vendorId === MINMOD_ACCESS ? undefined : vendorId,
    )
    if (!variant)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Variant with ID ${id} not found`,
      })

    await this._product.updateVariant(id, data)

    return { id: variant.id }
  }

  async delete(
    input: Validators.DeleteVariantInput,
  ): Promise<Validators.DeleteVariantOutput> {
    const { id, vendorId } = input

    const variant = await this._product.findVariant(
      id,
      vendorId === MINMOD_ACCESS ? undefined : vendorId,
    )
    if (!variant)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Variant with ID ${id} not found`,
      })

    await this._product.deleteVariant(variant.id)

    return { id: variant.id }
  }
}
