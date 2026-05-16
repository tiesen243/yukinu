import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'
import type { UpdateVendorStatusDto } from '@/modules/merchant/application/dtos/vendor/update-vendor-status.dto'
import type { VendorRepository } from '@/modules/merchant/domain/repositories/vendor.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class UpdateVendorStatusUseCase extends AbstractUseCase<
  UpdateVendorStatusDto.Input,
  UpdateVendorStatusDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _vendorRepo: VendorRepository,
    private readonly _userRepo: UserRepository,
  ) {
    super()
  }

  async execute(
    input: UpdateVendorStatusDto.Input,
  ): Promise<UpdateVendorStatusDto.Output> {
    const { id, ownerId, status } = input

    const [[vendor], [user]] = await Promise.all([
      this._vendorRepo.find(
        [{ id, ownerId: ownerId ?? 'null' }],
        {},
        { limit: 1 },
      ),
      this._userRepo.find([{ id: ownerId ?? '' }], {}, { limit: 1 }),
    ])
    if (!vendor)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Vendor with ID ${id} not found`,
      })

    const validTransitions = {
      pending: ['approved', 'rejected'],
      approved: ['suspended'],
      suspended: ['approved'],
      rejected: ['approved'],
    }[vendor.status]

    if (!validTransitions.includes(status))
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Invalid status transition from ${vendor.status} to ${status}`,
      })

    return this._db.transaction(async (tx) => {
      const updatedVendor = vendor.clone({ status })
      await this._vendorRepo.save(updatedVendor, tx)
      if (!user) return { id }

      if (status === 'approved') {
        const updatedUser = user.clone({ role: 'vendor_owner' })
        await this._userRepo.save(updatedUser, tx)
      } else if (
        (status === 'rejected' || status === 'suspended') &&
        user.role === 'vendor_owner'
      ) {
        const updatedUser = user.clone({ role: 'user' })
        await this._userRepo.save(updatedUser, tx)
      }

      return { id }
    })
  }
}
