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

  async all(data: VendorValidator.AllParams): Promise<{
    vendors: IVendorRepository.FindWithOwnerResult[]
    pagination: { page: number; total: number; totalPages: number }
  }> {
    const { status, page, limit } = data
    const offset = (page - 1) * limit
    const criteria = status ? [{ status }] : []

    const vendors = await this._vendorRepo.findWithOwner(
      criteria,
      limit,
      offset,
    )
    const total = await this._vendorRepo.count(criteria)
    const totalPages = Math.ceil(total / limit)

    return {
      vendors,
      pagination: { page, total, totalPages },
    }
  }

  register(
    data: IVendorRepository.NewVendorType,
  ): Promise<{ id: IVendorRepository.VendorType['id'] }> {
    return this._db.transaction(async (tx) => {
      const [existingVendor] = await this._vendorRepo.findBy(
        [{ ownerId: data.ownerId }],
        {},
        1,
        0,
        tx,
      )
      if (existingVendor)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You already has a registered vendor',
        })

      const vendor = await this._vendorRepo.create(
        { ...data, status: 'pending' },
        tx,
      )
      if (!vendor) return tx.rollback()

      return { id: vendor.id }
    })
  }

  update(data: VendorValidator.UpdateBody): Promise<void> {
    const { vendorId, status } = data

    return this._db.transaction(async (tx) => {
      const vendor = await this._vendorRepo.find(vendorId, tx)
      if (!vendor)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vendor not found',
        })

      if (vendor.status === status) return
      if (
        (vendor.status === 'pending' && status === 'suspended') ||
        (vendor.status === 'suspended' && status === 'pending') ||
        (vendor.status === 'approved' && status === 'pending')
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid status transition',
        })
      }

      await this._vendorRepo.update(vendorId, { status: status }, tx)

      const user = await this._userRepo.find(vendor.ownerId, tx)
      if (!user)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vendor owner not found',
        })

      if (
        vendor.status === 'pending' &&
        status === 'approved' &&
        user.role === 'user'
      )
        await this._userRepo.update(
          vendor.ownerId,
          { role: 'vendor_owner' },
          tx,
        )

      if (status === 'suspended' && user.role === 'vendor_owner')
        await this._userRepo.update(vendor.ownerId, { role: 'user' }, tx)
    })
  }

  delete(data: VendorValidator.OneParams): Promise<void> {
    const { vendorId } = data

    return this._db.transaction(async (tx) => {
      const vendor = await this._vendorRepo.find(vendorId, tx)
      if (!vendor)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vendor not found',
        })

      await this._vendorRepo.delete(vendorId, tx)
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
      if (user.role === 'user')
        await this._userRepo.update(user.id, { role: 'vendor_staff' })
    })
  }
}
