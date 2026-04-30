import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'
import type { VerificationRepository } from '@/modules/identity/domain/repositories/verification.repository'
import type { AcceptInvitationDto } from '@/modules/merchant/application/dtos/staff/accept-invitation.dto'
import type { VendorStaffRepository } from '@/modules/merchant/domain/repositories/vendor-staff.repository'
import type { VendorRepository } from '@/modules/merchant/domain/repositories/vendor.repository'

import { VendorStaffEntity } from '@/modules/merchant/domain/entities/vendor-staff.entity'

export class AcceptInvitationUseCase {
  public constructor(
    private readonly db: Database,
    private readonly verificationRepo: VerificationRepository,
    private readonly vendorRepo: VendorRepository,
    private readonly vendorStaffRepo: VendorStaffRepository,
    private readonly userRepo: UserRepository,
  ) {}

  public async execute(
    input: AcceptInvitationDto.Input,
  ): Promise<AcceptInvitationDto.Output> {
    const { token, userId } = input

    const [[verification], [user]] = await Promise.all([
      this.verificationRepo.find([{ token }], {}, { limit: 1 }),
      this.userRepo.find([{ id: userId }], {}, { limit: 1 }),
    ])

    if (!verification || !user)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invalid invitation token or user not found.',
      })

    if (
      verification?.userId !== userId &&
      !verification?.type.startsWith('invite_')
    )
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invalid invitation token.',
      })
    else if (verification.expiresAt < new Date())
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invitation token has expired.',
      })

    const vendorId = verification.type.replace('invite_', '')
    const [vendor] = await this.vendorRepo.find(
      [{ id: vendorId }],
      {},
      { limit: 1 },
    )

    if (!vendor)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Vendor with id ${vendorId} not found`,
      })

    return this.db.transaction(async (tx) => {
      await this.verificationRepo.delete([{ token }], tx)

      const updatedUser = user.clone({ role: 'vendor_staff' })
      await this.userRepo.save(updatedUser, tx)

      const staff = new VendorStaffEntity({ userId, vendorId })
      await this.vendorStaffRepo.save(staff, tx)

      return { userId }
    })
  }
}
