import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'
import type { RemoveStaffDto } from '@/modules/merchant/application/dtos/staff/remove-staff.dto'
import type { VendorStaffRepository } from '@/modules/merchant/domain/repositories/vendor-staff.repository'

import { UserEntity } from '@/modules/identity/domain/entities/user.entity'

export class RemoveStaffUseCase {
  public constructor(
    private readonly db: Database,
    private readonly userRepo: UserRepository,
    private readonly vendorStaffRepo: VendorStaffRepository,
  ) {}

  public async execute(
    input: RemoveStaffDto.Input,
  ): Promise<RemoveStaffDto.Output> {
    const { vendorId, userId } = input

    const [staff] = await this.vendorStaffRepo.findWithUser(
      [{ vendorId, userId }],
      {},
      { limit: 1 },
    )
    if (!staff)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Staff with user id ${userId} not found in vendor ${vendorId}`,
      })

    return this.db.transaction(async (tx) => {
      const updatedUser = new UserEntity({
        id: userId,
        username: staff.username,
        email: staff.email,
        role: 'user',
      })
      await this.userRepo.save(updatedUser, tx)

      await this.vendorStaffRepo.delete([{ vendorId, userId }], tx)

      return { userId }
    })
  }
}
