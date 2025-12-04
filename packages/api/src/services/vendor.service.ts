import { TRPCError } from '@trpc/server'

import type { VendorValidators } from '@yukinu/validators/vendor'
import { users } from '@yukinu/db/schema'
import { sendEmail } from '@yukinu/email'
import { env } from '@yukinu/validators/env'

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

  async inviteStaff(
    input: VendorValidators.InviteStaffInput,
  ): Promise<VendorValidators.InviteStaffOutput> {
    const { and, eq } = this._orm
    const { users, vendorStaffs, vendors, verifications } = this._schema
    const { vendorId, email } = input

    const [user] = await this._db
      .select({ id: users.id, username: users.username, role: users.role })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with email ${email} not found`,
      })

    if (user.role !== 'user')
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'This user cannot be added as vendor staff',
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

    const [vendor] = await this._db
      .select({
        vendorName: vendors.name,
        inviterName: users.username,
        inviterEmail: users.email,
      })
      .from(vendors)
      .where(eq(vendors.id, vendorId))
      .innerJoin(users, eq(users.id, vendors.ownerId))
      .limit(1)
    if (!vendor)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Vendor with ID ${vendorId} not found`,
      })

    const token = crypto.randomUUID()

    await this._db.insert(verifications).values({
      token,
      userId: user.id,
      type: `invite_${vendorId}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })

    const { inviterName, inviterEmail, vendorName } = vendor
    const inviteLink = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}/invite?token=${token}`
    await sendEmail({
      to: email,
      subject: 'Vendor Staff Invitation',
      template: 'Invite',
      data: {
        username: user.username,
        inviterEmail,
        inviterName,
        vendorName,
        inviteLink,
      },
    })
  }

  async acceptStaffInvitation(
    input: VendorValidators.AcceptStaffInvitationInput,
    userId: string,
  ): Promise<VendorValidators.AcceptStaffInvitationOutput> {
    const { eq } = this._orm
    const { vendorStaffs, vendors, verifications } = this._schema
    const { token } = input

    const [verification] = await this._db
      .select()
      .from(verifications)
      .where(eq(verifications.token, token))
      .limit(1)
    if (
      verification?.userId !== userId &&
      !verification?.type.startsWith('invite_')
    )
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invalid invitation token.',
      })

    return this._db.transaction(async (tx) => {
      if (verification.expiresAt < new Date()) {
        await tx.delete(verifications).where(eq(verifications.token, token))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'The invitation has expired.',
        })
      }

      const vendorId = verification.type.slice('invite_'.length)
      const [vendor] = await tx
        .select({ id: vendors.id, staffId: vendorStaffs.userId })
        .from(vendors)
        .where(eq(vendors.id, vendorId))
        .leftJoin(vendorStaffs, eq(vendorStaffs.userId, verification.userId))
        .limit(1)

      if (!vendor)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Vendor with ID ${vendorId} not found`,
        })

      if (vendor.staffId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are already a staff member of this vendor',
        })

      await tx
        .insert(vendorStaffs)
        .values({ vendorId, userId: verification.userId })
      await tx
        .update(users)
        .set({ role: 'vendor_staff' })
        .where(eq(users.id, verification.userId))
      await tx.delete(verifications).where(eq(verifications.token, token))
    })
  }

  async removeStaff(
    input: VendorValidators.RemoveStaffInput,
  ): Promise<VendorValidators.RemoveStaffOutput> {
    const { and, eq } = this._orm
    const { vendorStaffs } = this._schema
    const { vendorId, staffId } = input

    return this._db.transaction(async (tx) => {
      const [deletedStaff] = await tx
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

      await tx.update(users).set({ role: 'user' }).where(eq(users.id, staffId))
    })
  }
}
