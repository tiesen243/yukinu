import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'
import { Password } from '@yukinu/auth'

import type { ResetPasswordDto } from '@/modules/identity/application/dtos/auth/reset-password.dto'
import type { AccountRepository } from '@/modules/identity/domain/repositories/account.repository'
import type { VerificationRepository } from '@/modules/identity/domain/repositories/verification.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class ResetPasswordUseCase extends AbstractUseCase<
  ResetPasswordDto.Input,
  ResetPasswordDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _accountRepo: AccountRepository,
    private readonly _verificationRepo: VerificationRepository,
  ) {
    super()
  }

  public async execute(
    input: ResetPasswordDto.Input,
  ): Promise<ResetPasswordDto.Output> {
    const { token, newPassword } = input
    const [verification] = await this._verificationRepo.find(
      [{ token, type: 'password_reset' }],
      {},
      { limit: 1 },
    )
    if (!verification)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid or expired password reset token.',
      })

    const [existingAccount] = await this._accountRepo.find(
      [{ userId: verification.userId, provider: 'credentials' }],
      {},
      { limit: 1 },
    )
    if (!existingAccount)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Account associated with the password reset token not found.',
      })

    const { userId, expiresAt } = verification
    return this._db.transaction(async (tx) => {
      await this._verificationRepo.delete([{ token }], tx)

      if (expiresAt < new Date())
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'The password reset token has expired.',
        })

      const password = await new Password().hash(newPassword)
      const updatedAccount = existingAccount.clone({ password })
      await this._accountRepo.save(updatedAccount, tx)

      return { userId }
    })
  }
}
