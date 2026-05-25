import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'
import type { VerificationRepository } from '@/modules/identity/domain/repositories/verification.repository'
import type { AcceptInvitationDto } from '@/modules/merchant/application/dtos/staff/accept-invitation.dto'
import type { VendorStaffRepository } from '@/modules/merchant/domain/repositories/vendor-staff.repository'
import type { VendorRepository } from '@/modules/merchant/domain/repositories/vendor.repository'

import { UserEntity } from '@/modules/identity/domain/entities/user.entity'
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
    const { token } = input

    const [verification] = await this.verificationRepo.findWithUser(
      [{ token }],
      {},
      { limit: 1 },
    )

    if (!verification)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invalid invitation token.',
      })

    if (!verification?.type.startsWith('invite_'))
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

      const updatedUser = new UserEntity({
        ...verification.user,
        role: 'vendor_staff',
      })
      await this.userRepo.save(updatedUser, tx)

      const staff = new VendorStaffEntity({
        userId: verification.user.id,
        vendorId,
      })
      await this.vendorStaffRepo.save(staff, tx)

      return { userId: verification.user.id }
    })
  }
}
