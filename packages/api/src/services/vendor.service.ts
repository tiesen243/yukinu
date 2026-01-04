import type { IUserRepository } from '@/contracts/repositories/user.repository'
import type { IVendorRepository } from '@/contracts/repositories/vendor.repository'
import type { IVendorService } from '@/contracts/services/vendor.service'
import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/vendor'

import { TRPCError } from '@trpc/server'

export class VendorService implements IVendorService {
  constructor(
    private readonly _db: Database,
    private readonly _vendor: IVendorRepository,
    private readonly _user: IUserRepository,
  ) {}

  async all(
    input: Validators.AllVendorsInput,
  ): Promise<Validators.AllVendorsOutput> {
    const { search, status, page, limit } = input
    const offset = (page - 1) * limit

    const whereClauses = [
      search ? { name: `%${search}%` } : {},
      status ? { status } : {},
    ]

    const [vendors, total] = await Promise.all([
      this._vendor.allWithRelations(
        whereClauses,
        { createdAt: 'desc' },
        { limit, offset },
      ),
      this._vendor.count(whereClauses),
    ])
    const totalPages = Math.ceil(total / limit)

    return {
      vendors,
      pagination: { total, page, limit, totalPages },
    }
  }

  async one(
    input: Validators.OneVendorInput,
  ): Promise<Validators.OneVendorOutput> {
    const vendor = await this._vendor.find(input.id)
    if (!vendor)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Vendor with ID ${input.id} not found`,
      })

    return vendor
  }

  async create(
    input: Validators.CreateVendorInput,
  ): Promise<Validators.CreateVendorOutput> {
    const { ownerId } = input

    const [vendor] = await this._vendor.all([{ ownerId }], {}, { limit: 1 })
    if (vendor)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'You already own a vendor or application is pending',
      })

    const newVendor = await this._vendor.create(input)

    return { id: newVendor }
  }

  async updateStatus(
    input: Validators.UpdateVendorStatusInput,
  ): Promise<Validators.UpdateVendorStatusOutput> {
    const { id, status } = input

    const vendor = await this._vendor.find(id)
    if (!vendor)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Vendor with ID ${id} not found`,
      })

    const { status: currentStatus, ownerId } = vendor
    if (!ownerId)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Vendor with ID ${id} has no owner assigned`,
      })

    const validTransitions = {
      pending: ['approved', 'suspended'],
      approved: ['suspended'],
      suspended: ['approved'],
    }[currentStatus]

    if (!validTransitions.includes(status))
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Invalid status transition from ${currentStatus} to ${status}`,
      })

    return this._db.transaction(async (tx) => {
      await this._vendor.update(id, { status }, tx)

      if (status === 'approved')
        await this._user.update(ownerId, { role: 'vendor_owner' }, tx)
      else if (status === 'suspended')
        await this._user.update(ownerId, { role: 'user' }, tx)

      return { id }
    })
  }

  async update(
    input: Validators.UpdateVendorInput,
  ): Promise<Validators.UpdateVendorOutput> {
    const { id, ...data } = input

    const vendor = await this._vendor.find(id)
    if (!vendor)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Vendor with ID ${id} not found`,
      })

    await this._vendor.update(id, data)

    return { id }
  }
}
