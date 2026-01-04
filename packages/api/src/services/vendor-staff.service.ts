import type { IUserRepository } from '@/contracts/repositories/user.repository'
import type { IVendorRepository } from '@/contracts/repositories/vendor.repository'
import type { IVerificationRepository } from '@/contracts/repositories/verification.repository'
import type { IVendorStaffService } from '@/contracts/services/vendor-staff.service'
import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/vendor'

import { TRPCError } from '@trpc/server'
import { sendEmail } from '@yukinu/email'
import { env } from '@yukinu/validators/env'

export class VendorStaffService implements IVendorStaffService {
  constructor(
    private readonly _db: Database,
    private readonly _user: IUserRepository,
    private readonly _vendor: IVendorRepository,
    private readonly _verification: IVerificationRepository,
  ) {}

  all(input: Validators.AllStaffsInput): Promise<Validators.AllStaffsOutput> {
    return this._vendor.allStaffByVendorId(input.id)
  }

  async invite(
    input: Validators.InviteStaffInput,
  ): Promise<Validators.InviteStaffOutput> {
    const { email, vendorId } = input

    const [user] = await this._user.all([{ email }], {}, { limit: 1 })
    if (!user)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with email ${input.email} not found`,
      })

    if (user.role !== 'user')
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'This user cannot be added as vendor staff',
      })

    const staff = await this._vendor.findStaff(vendorId, user.id)
    if (staff)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `User with email ${email} is already a staff member of your vendor`,
      })

    const token = crypto.randomUUID()
    await this._verification.create({
      token,
      userId: user.id,
      type: `invite_${vendorId}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })

    const [vendor] = await this._vendor.allWithRelations(
      [{ id: vendorId }],
      {},
      { limit: 1 },
    )
    if (!vendor)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Vendor with id ${vendorId} not found`,
      })

    const inviteLink = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}/invite?token=${token}`
    await sendEmail({
      to: email,
      subject: 'Vendor Staff Invitation',
      template: 'Invite',
      data: {
        username: user.username,
        inviterEmail: input.email,
        inviterName: vendor.owner.username,
        vendorName: vendor.name,
        inviteLink,
      },
    })

    return { userId: user.id }
  }

  async acceptInvitation(
    input: Validators.AcceptStaffInvitationInput,
  ): Promise<Validators.AcceptStaffInvitationOutput> {
    const { token, userId } = input

    const verification = await this._verification.find(token)

    return this._db.transaction(async (tx) => {
      if (
        verification?.userId !== userId &&
        !verification?.type.startsWith('invite_')
      ) {
        await this._verification.delete(token, tx)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Invalid invitation token.',
        })
      } else if (verification.expiresAt < new Date()) {
        await this._verification.delete(token, tx)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Invitation token has expired.',
        })
      }

      const vendorId = verification.type.replace('invite_', '')
      const vendor = await this._vendor.find(vendorId, tx)
      if (!vendor)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Vendor with id ${vendorId} not found`,
        })

      await this._user.update(userId, { role: 'vendor_staff' }, tx)
      await this._vendor.addStaff(vendorId, userId, tx)
      await this._verification.delete(token, tx)

      return { userId }
    })
  }

  remove(
    input: Validators.RemoveStaffInput,
  ): Promise<Validators.RemoveStaffOutput> {
    const { vendorId, userId } = input

    return this._db.transaction(async (tx) => {
      const staff = await this._vendor.findStaff(vendorId, userId, tx)
      if (!staff)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Staff with user id ${userId} not found in vendor ${input.vendorId}`,
        })

      await this._user.update(userId, { role: 'user' }, tx)
      await this._vendor.removeStaff(vendorId, userId)

      return { userId }
    })
  }
}
