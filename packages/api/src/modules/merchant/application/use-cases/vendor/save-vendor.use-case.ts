import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { SaveVendorDto } from '@/modules/merchant/application/dtos/vendor/save-vendor.dto'
import type { VendorRepository } from '@/modules/merchant/domain/repositories/vendor.repository'

import { VendorEntity } from '@/modules/merchant/domain/entities/vendor.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class SaveVendorUseCase extends AbstractUseCase<
  SaveVendorDto.Input,
  SaveVendorDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _vendorRepo: VendorRepository,
  ) {
    super()
  }

  async execute(input: SaveVendorDto.Input): Promise<SaveVendorDto.Output> {
    const [existingVendor] = await this._vendorRepo.find(
      [{ ownerId: input.ownerId }, ...(input.id ? [{ id: input.id }] : [])],
      {},
      { limit: 1 },
    )

    if (input.id && !existingVendor)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Vendor with ID ${input.id} not found`,
      })

    if (!input.id && existingVendor)
      throw new TRPCError({
        code: 'CONFLICT',
        message: `Your vendor registration is pending approval. Please wait for the approval process to complete before registering again.`,
      })

    const vendor = new VendorEntity(input)
    await this._vendorRepo.save(vendor)

    return { id: vendor.id }
  }
}
