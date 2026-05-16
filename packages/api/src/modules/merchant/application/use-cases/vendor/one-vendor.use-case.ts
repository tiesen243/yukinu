import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { OneVendorDto } from '@/modules/merchant/application/dtos/vendor/one-vendor.dto'
import type { VendorRepository } from '@/modules/merchant/domain/repositories/vendor.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class OneVendorUseCase extends AbstractUseCase<
  OneVendorDto.Input,
  OneVendorDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly vendorRepo: VendorRepository,
  ) {
    super()
  }

  async execute(input: OneVendorDto.Input): Promise<OneVendorDto.Output> {
    const [vendor] = await this.vendorRepo.find([input], {}, { limit: 1 })
    if (!vendor)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Vendor with ID ${input.id} not found`,
      })

    return vendor
  }
}
