import type { Database } from '@yukinu/db/drizzle'

import type { AllVendorsDto } from '@/modules/merchant/application/dtos/vendor/all-vendors.dto'
import type { VendorRepository } from '@/modules/merchant/domain/repositories/vendor.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class AllVendorsUseCase extends AbstractUseCase<
  AllVendorsDto.Input,
  AllVendorsDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly vendorRepo: VendorRepository,
  ) {
    super()
  }

  async execute(input: AllVendorsDto.Input): Promise<AllVendorsDto.Output> {
    const { search, status, page, limit } = input
    const offset = (page - 1) * limit

    const whereClauses = [
      search ? { name: { $like: search } } : {},
      status ? { status } : {},
    ]

    const [vendors, total] = await Promise.all([
      this.vendorRepo.findWithDetails(
        whereClauses,
        { createdAt: 'desc' },
        { limit, offset },
      ),
      this.vendorRepo.count(whereClauses),
    ])
    const totalPages = Math.ceil(total / limit)

    return {
      vendors,
      pagination: { total, page, limit, totalPages },
    }
  }
}
