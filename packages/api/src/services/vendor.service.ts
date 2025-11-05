import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db'
import type { VendorValidator } from '@yukinu/validators/vendor'

import type { IVendorRepository } from '@/contracts/repositories/vendor.repository'
import type { IVendorService } from '@/contracts/services/vendor.service'
import type { IUserRepository } from '@/types'

export class VendorService implements IVendorService {
  constructor(
    private readonly _db: Database,
    private readonly _userRepo: IUserRepository,
    private readonly _vendorRepo: IVendorRepository,
  ) {}

  all(
    data: VendorValidator.AllParams,
  ): Promise<IVendorRepository.VendorType[]> {
    const { status, page, limit } = data
    const offset = (page - 1) * limit

    const vendors = this._vendorRepo.findBy(
      status ? [{ status }] : [],
      { createdAt: 'desc' },
      limit,
      offset,
    )

    return vendors
  }

  register(
    data: IVendorRepository.NewVendorType,
  ): Promise<{ id: IVendorRepository.VendorType['id'] }> {
    return this._db.transaction(async (tx) => {
      const vendor = await this._vendorRepo.create(
        { ...data, status: 'pending' },
        tx,
      )
      if (!vendor) return tx.rollback()

      return { id: vendor.id }
    })
  }

  approve(data: VendorValidator.ApproveBody): Promise<void> {
    const { vendorId } = data

    return this._db.transaction(async (tx) => {
      const vendor = await this._vendorRepo.find(vendorId, tx)
      if (!vendor) return tx.rollback()

      await this._vendorRepo.update(vendorId, { status: 'approved' }, tx)
      await this._userRepo.update(vendor.ownerId, { role: 'vendor_owner' }, tx)
    })
  }

  inviteMember(data: VendorValidator.InviteBody): Promise<void> {
    const { vendorId, email } = data

    return this._db.transaction(async (tx) => {
      const vendor = await this._vendorRepo.find(vendorId, tx)
      if (!vendor)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vendor not found',
        })

      const [user] = await this._userRepo.findBy([{ email }], {}, 1, 0, tx)
      if (!user)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User with the provided email not found',
        })

      const member = await this._vendorRepo.getMember(vendorId, user.id, tx)
      if (member)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User is already a member of the vendor',
        })

      await this._vendorRepo.addMember(vendorId, user.id, tx)
    })
  }
}
