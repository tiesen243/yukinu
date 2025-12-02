import { TRPCError } from '@trpc/server'

import type { VendorValidators } from '@yukinu/validators/vendor'
import { users } from '@yukinu/db/schema'

import type { IVendorService } from '@/contracts/services/vendor.service'
import { BaseService } from '@/services/base.service'

export class VendorService extends BaseService implements IVendorService {
  async all(
    input: VendorValidators.AllInput,
  ): Promise<VendorValidators.AllOutput> {
    const { and, desc, eq, ilike, count } = this._orm
    const { vendors, vendorStaffs } = this._schema
    const { search, status, page, limit } = input
    const offset = (page - 1) * limit

    const whereClause = []
    if (search) whereClause.push(ilike(vendors.name, `%${search}%`))
    if (status) whereClause.push(eq(vendors.status, status))

    const [vendorsList, total] = await Promise.all([
      this._db
        .select({
          id: vendors.id,
          name: vendors.name,
          status: vendors.status,
          owner: { id: users.id, username: users.username },
          staffCount: count(vendorStaffs.userId),
          createdAt: vendors.createdAt,
          updatedAt: vendors.updatedAt,
        })
        .from(vendors)
        .where(and(...whereClause))
        .innerJoin(users, eq(users.id, vendors.ownerId))
        .leftJoin(vendorStaffs, eq(vendorStaffs.vendorId, vendors.id))
        .orderBy(desc(vendors.createdAt))
        .offset(offset)
        .limit(limit)
        .groupBy(vendors.id, users.id),

      this._db.$count(vendors, and(...whereClause)),
    ])
    const totalPages = Math.ceil(total / limit)

    return {
      vendors: vendorsList,
      pagination: { total, page, limit, totalPages },
    }
  }

  async one(
    input: VendorValidators.OneInput,
  ): Promise<VendorValidators.OneOutput> {
    const { eq } = this._orm
    const { vendors, vendorStaffs } = this._schema
    const { id } = input

    const [[vendor], staffs] = await Promise.all([
      this._db
        .select({
          id: vendors.id,
          name: vendors.name,
          description: vendors.description,
          image: vendors.image,
          address: vendors.address,
          status: vendors.status,
          owner: { id: users.id, username: users.username },
          createdAt: vendors.createdAt,
          updatedAt: vendors.updatedAt,
        })
        .from(vendors)
        .where(eq(vendors.id, id))
        .innerJoin(users, eq(users.id, vendors.ownerId))
        .limit(1),
      this._db
        .select({ id: users.id, username: users.username })
        .from(vendorStaffs)
        .where(eq(vendorStaffs.vendorId, id))
        .innerJoin(users, eq(users.id, vendorStaffs.userId))
        .orderBy(users.username),
    ])

    if (!vendor)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Vendor with ID ${id} not found`,
      })

    return { ...vendor, staffs }
  }

  async create(
    input: VendorValidators.CreateInput,
  ): Promise<VendorValidators.CreateOutput> {
    const { eq } = this._orm
    const { vendors } = this._schema

    const [vendor] = await this._db
      .select({ id: vendors.id })
      .from(vendors)
      .where(eq(vendors.ownerId, input.ownerId))
      .limit(1)
    if (vendor)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You already own a vendor or application is pending',
      })

    const [result] = await this._db
      .insert(vendors)
      .values({ ...input })
      .returning({ id: vendors.id })

    if (!result?.id)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to create vendor`,
      })

    return result
  }

  async updateStatus(
    input: VendorValidators.UpdateStatusInput,
  ): Promise<VendorValidators.UpdateStatusOutput> {
    const { eq } = this._orm
    const { vendors, users } = this._schema
    const { id, status } = input

    const { status: currentStatus, owner } = await this.one({ id })
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
      if (status === 'approved') {
        await tx
          .update(users)
          .set({ role: 'vendor_owner' })
          .where(eq(users.id, owner.id))
        await tx
          .update(vendors)
          .set({ status: 'approved' })
          .where(eq(vendors.id, id))
      } else if (status === 'suspended') {
        await tx
          .update(vendors)
          .set({ status: 'suspended' })
          .where(eq(vendors.id, id))
        await tx
          .update(users)
          .set({ role: 'user' })
          .where(eq(users.id, owner.id))
      }

      return { id }
    })
  }

  async update(
    input: VendorValidators.UpdateInput,
  ): Promise<VendorValidators.UpdateOutput> {
    const { eq } = this._orm
    const { vendors } = this._schema
    const { id, ...data } = input

    await this.one({ id })
    await this._db
      .update(vendors)
      .set({ ...data })
      .where(eq(vendors.id, id))

    return { id }
  }

  async allStaffs(
    input: VendorValidators.AllStaffsInput,
  ): Promise<VendorValidators.AllStaffsOutput> {
    const { eq } = this._orm
    const { vendorStaffs } = this._schema
    const { vendorId } = input

    return this._db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        assignedAt: vendorStaffs.assignedAt,
      })
      .from(vendorStaffs)
      .where(eq(vendorStaffs.vendorId, vendorId))
      .innerJoin(users, eq(users.id, vendorStaffs.userId))
      .orderBy(users.username)
  }

  async addStaff(
    input: VendorValidators.AddStaffInput,
  ): Promise<VendorValidators.AddStaffOutput> {
    const { and, eq } = this._orm
    const { users, vendorStaffs } = this._schema
    const { vendorId, email } = input

    const [user] = await this._db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
    if (!user)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found with the provided email',
      })

    if (user.role !== 'user')
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'This user cannot be added as staff',
      })

    const [existingStaff] = await this._db
      .select()
      .from(vendorStaffs)
      .where(
        and(
          eq(vendorStaffs.vendorId, vendorId),
          eq(vendorStaffs.userId, user.id),
        ),
      )
      .limit(1)
    if (existingStaff)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `User with email ${email} is already a staff member of your vendor`,
      })

    await this._db.insert(vendorStaffs).values({ vendorId, userId: user.id })
  }

  async removeStaff(
    input: VendorValidators.RemoveStaffInput,
  ): Promise<VendorValidators.RemoveStaffOutput> {
    const { and, eq } = this._orm
    const { vendorStaffs } = this._schema
    const { vendorId, staffId } = input

    const [deletedStaff] = await this._db
      .delete(vendorStaffs)
      .where(
        and(
          eq(vendorStaffs.vendorId, vendorId),
          eq(vendorStaffs.userId, staffId),
        ),
      )
      .returning({ id: vendorStaffs.userId })

    if (!deletedStaff?.id)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Staff with ID ${staffId} not found in your vendor`,
      })
  }
}
