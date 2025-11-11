import type { Database } from '@yukinu/db'
import type { VendorModels } from '@yukinu/validators/vendor'

import type { IVendorRepository } from '@/contracts/repositories/vendor.repository'
import type { IVendorService } from '@/contracts/services/vendor.service'

export class VendorService implements IVendorService {
  constructor(
    private readonly _db: Database,
    private readonly _vendorRepo: IVendorRepository,
  ) {}

  public async all(
    input: VendorModels.AllInput,
  ): Promise<VendorModels.AllOutput> {
    const { status, page, limit } = input
    const offset = (page - 1) * limit

    const criteria = status ? [{ status }] : []

    const vendors = await this._vendorRepo.findBy(
      criteria,
      { createdAt: 'desc' },
      limit,
      offset,
    )

    const totalItems = await this._vendorRepo.count(criteria)
    const totalPages = Math.ceil(totalItems / limit)

    return {
      vendors,
      pagination: { page, totalPages, totalItems },
    }
  }

  public register(
    input: VendorModels.RegisterInput,
  ): Promise<VendorModels.RegisterOutput> {
    throw new Error('Method not implemented.')
  }

  public update(
    input: VendorModels.UpdateInput,
  ): Promise<VendorModels.UpdateOutput> {
    throw new Error('Method not implemented.')
  }

  public delete(
    input: VendorModels.DeleteInput,
  ): Promise<VendorModels.DeleteOutput> {
    throw new Error('Method not implemented.')
  }
}
