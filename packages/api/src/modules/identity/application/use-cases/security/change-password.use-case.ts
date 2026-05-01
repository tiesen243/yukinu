import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'
import { Password } from '@yukinu/auth'
import { sendEmail } from '@yukinu/email'

import type { ChangePasswordDto } from '@/modules/identity/application/dtos/security/change-password.dto'
import type { AccountRepository } from '@/modules/identity/domain/repositories/account.repository'
import type { SessionRepository } from '@/modules/identity/domain/repositories/session.repository'
import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'

import { AccountEntity } from '@/modules/identity/domain/entities/account.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class ChangePasswordUseCase extends AbstractUseCase<
  ChangePasswordDto.Input,
  ChangePasswordDto.Output
> {
  private readonly _password = new Password()

  constructor(
    private readonly _db: Database,
    private readonly _accountRepo: AccountRepository,
    private readonly _sessionRepo: SessionRepository,
    private readonly _userRepo: UserRepository,
  ) {
    super()
  }
  async execute(
    input: ChangePasswordDto.Input,
  ): Promise<ChangePasswordDto.Output> {
    const { userId, currentPassword, newPassword, isLogout } = input
    if (!userId)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User ID is required.',
      })

    const [[user], [account]] = await Promise.all([
      this._userRepo.find([{ id: userId }], {}, { limit: 1 }),
      this._accountRepo.find(
        [{ id: userId, provider: 'credentials' }],
        {},
        { limit: 1 },
      ),
    ])

    if (!user)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User with id ${userId} not found`,
      })

    if (account?.password) {
      if (!currentPassword)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Current password is required to change password.',
        })

      if (currentPassword === newPassword)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'The new password must be different from the current one.',
        })

      if (!(await this._password.verify(account.password, currentPassword)))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'The current password is incorrect.',
        })
    }

    const hashed = await this._password.hash(newPassword)
    const updatedAccount = new AccountEntity({
      userId,
      provider: 'credentials',
      providerAccountId: userId,
      password: hashed,
    })
    await this._accountRepo.save(updatedAccount)

    if (isLogout) await this._sessionRepo.delete([{ userId }])
    await sendEmail({
      to: user.email,
      subject: 'Yukinu Password Changed',
      template: 'ChangePassword',
      data: { username: user.username },
    })

    return { userId }
  }
}
