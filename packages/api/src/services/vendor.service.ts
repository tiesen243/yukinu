import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db'
import type { UserModels } from '@yukinu/validators/user'
import type { VendorModels } from '@yukinu/validators/vendor'

import type { IVendorService } from '@/contracts/services/vendor.service'
import type { IUserRepository, IVendorRepository } from '@/types'

export class VendorService implements IVendorService {
  constructor(
    private readonly _db: Database,
    private readonly _userRepo: IUserRepository,
    private readonly _vendorRepo: IVendorRepository,
  ) {}

  public async all(
    input: VendorModels.AllInput,
  ): Promise<VendorModels.AllOutput> {
    const { status, page, limit } = input
    const offset = (page - 1) * limit

    const criteria = status ? [{ status }] : []

    const vendors = await this._vendorRepo.findWithOwner(
      criteria,
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

  public async one(
    actingUser: Pick<UserModels.User, 'id' | 'role'>,
  ): Promise<Pick<VendorModels.Vendor, 'id'>> {
    if (actingUser.role === 'vendor_owner') {
      const [vendor] = await this._vendorRepo.findBy(
        [{ ownerId: actingUser.id }],
        {},
        1,
      )
      if (!vendor)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vendor not found for the acting user.',
        })
      return vendor
    }

    if (actingUser.role === 'vendor_staff') {
      const vendor = await this._vendorRepo.findByStaffId(actingUser.id)
      if (!vendor)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Vendor not found for the acting user.',
        })
      return vendor
    }

    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Vendor not found for the acting user.',
    })
  }

  public async register(
    input: VendorModels.RegisterInput,
  ): Promise<VendorModels.RegisterOutput> {
    const { userId, ...data } = input
    const [existingVendor] = await this._vendorRepo.findBy(
      [{ ownerId: userId }],
      {},
      1,
    )
    if (existingVendor)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'You already have a vendor registered.',
      })

    const { id } = await this._vendorRepo.create({
      ownerId: userId,
      ...data,
    })
    return { vendorId: id }
  }

  public async update(
    input: VendorModels.UpdateInput,
    actingUser: Pick<UserModels.User, 'id' | 'role'>,
  ): Promise<VendorModels.UpdateOutput> {
    const { id = '', ...updateData } = input

    const existingVendor = await this._vendorRepo.find(id)
    if (!existingVendor)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Vendor with ID ${id} not found.`,
      })

    const isInvalidStatusTransition = (
      from: VendorModels.Vendor['status'],
      to: VendorModels.Vendor['status'] | undefined,
    ) =>
      (from === 'pending' && to === 'suspended') ||
      (to === 'pending' && from !== 'pending')

    if (isInvalidStatusTransition(existingVendor.status, updateData.status))
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid status transition.',
      })

    if (existingVendor.status === updateData.status) return { vendorId: id }

    this.checkModifyPermissions(existingVendor, actingUser)
    const statusRoleMap = {
      pending: 'user',
      approved: 'vendor_owner',
      suspended: 'user',
    } as const satisfies Record<VendorModels.Status, UserModels.Role>

    return this._db.transaction(async (tx) => {
      await this._vendorRepo.update(id, updateData, tx)

      if (updateData.status)
        await this._userRepo.update(
          existingVendor.ownerId,
          { role: statusRoleMap[updateData.status] },
          tx,
        )

      return { vendorId: id }
    })
  }

  public async delete(
    input: VendorModels.DeleteInput,
    actingUser: Pick<UserModels.User, 'id' | 'role'>,
  ): Promise<VendorModels.DeleteOutput> {
    const { id } = input

    const existingVendor = await this._vendorRepo.find(id)
    if (!existingVendor)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Vendor with ID ${id} not found.`,
      })

    this.checkModifyPermissions(existingVendor, actingUser)

    return this._db.transaction(async (tx) => {
      await this._vendorRepo.delete(id, tx)
      await this._userRepo.update(existingVendor.ownerId, { role: 'user' }, tx)

      return { vendorId: id }
    })
  }

  private checkModifyPermissions(
    vendor: Pick<VendorModels.Vendor, 'id' | 'ownerId'>,
    actingUser: Pick<UserModels.User, 'id' | 'role'>,
  ) {
    if (
      actingUser.role !== 'admin' &&
      actingUser.role !== 'moderator' &&
      vendor.ownerId !== actingUser.id
    )
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to modify this vendor.',
      })
  }
}
