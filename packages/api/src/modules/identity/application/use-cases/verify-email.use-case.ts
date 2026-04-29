import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'

import type { VerifyEmailDto } from '@/modules/identity/application/dtos/verify-email.dto'
import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'
import type { VerificationRepository } from '@/modules/identity/domain/repositories/verification.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class VerifyEmailUseCase extends AbstractUseCase<
  VerifyEmailDto.Input,
  VerifyEmailDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _userRepo: UserRepository,
    private readonly _verificationRepo: VerificationRepository,
  ) {
    super()
  }

  public async execute(
    input: VerifyEmailDto.Input,
  ): Promise<VerifyEmailDto.Output> {
    const { token } = input
    const verification = await this._verificationRepo.find({
      token,
      type: 'email',
    })
    if (!verification)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid or expired verification token.',
      })

    const existingUser = await this._userRepo.find({ id: verification.userId })
    if (!existingUser)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User associated with the verification token not found.',
      })

    const { userId, expiresAt } = verification
    return this._db.transaction(async (tx) => {
      if (expiresAt < new Date()) {
        await this._verificationRepo.delete({ token }, tx)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'The verification token has expired.',
        })
      }

      const updatedUser = existingUser.clone({ emailVerified: new Date() })
      await this._userRepo.save(updatedUser, tx)
      await this._verificationRepo.delete({ token }, tx)

      return { userId }
    })
  }
}
