import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'
import { sendEmail } from '@yukinu/email'

import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'
import type { VerificationRepository } from '@/modules/identity/domain/repositories/verification.repository'
import type { InviteStaffDto } from '@/modules/merchant/application/dtos/staff/invite-staff.dto'
import type { VendorStaffRepository } from '@/modules/merchant/domain/repositories/vendor-staff.repository'
import type { VendorRepository } from '@/modules/merchant/domain/repositories/vendor.repository'

import { VerificationEntity } from '@/modules/identity/domain/entities/verification.entity'

export class InviteStaffUseCase {
  public constructor(
    private readonly db: Database,
    private readonly userRepo: UserRepository,
    private readonly vendorRepo: VendorRepository,
    private readonly vendorStaffRepo: VendorStaffRepository,
    private readonly verificationRepo: VerificationRepository,
  ) {}

  async execute(input: InviteStaffDto.Input): Promise<InviteStaffDto.Output> {
    const { email, vendorId } = input

    const [user] = await this.userRepo.find([{ email }], {}, { limit: 1 })
    if (user?.role !== 'user')
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'This user cannot be added as vendor staff',
      })

    const [staff] = await this.vendorStaffRepo.find(
      [{ vendorId, userId: user.id }],
      {},
      { limit: 1 },
    )
    if (staff)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `User with email ${email} is already a staff member of your vendor`,
      })

    const verification = new VerificationEntity({
      userId: user.id,
      type: `invite_${vendorId}`,
    })
    await this.verificationRepo.save(verification)

    const [vendor] = await this.vendorRepo.findWithOwner(
      [{ id: vendorId }],
      {},
      { limit: 1 },
    )
    if (!vendor)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Vendor with id ${vendorId} not found`,
      })

    const inviteLink = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/invite?token=${verification.token}`
    await sendEmail({
      to: email,
      subject: `Invitation to join ${vendor.name} on Yukinu`,
      template: 'Invite',
      data: {
        username: user.username,
        inviterName: vendor.owner.username,
        vendorName: vendor.name,
        inviteLink,
      },
    })

    return { userId: user.id }
  }
}
