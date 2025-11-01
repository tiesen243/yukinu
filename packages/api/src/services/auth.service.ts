import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db/types'
import type { AuthValidator } from '@yukinu/validators/auth'
import { invalidateSessionTokens, Password } from '@yukinu/auth'

import type { IAccountRepository } from '../contracts/repositories/account.repository'
import type { IUserRepository } from '../contracts/repositories/user.repository'
import type { IAuthService } from '../contracts/services/auth.service'

export class AuthService implements IAuthService {
  private readonly _password: Password

  constructor(
    private readonly _db: Database,
    private readonly _accountRepo: IAccountRepository,
    private readonly _userRepo: IUserRepository,
  ) {
    this._password = new Password()
  }

  async register(data: AuthValidator.RegisterBody): Promise<{ id: string }> {
    const { username, email } = data

    const userExists = await this._userRepo.findByIdentifier({
      username,
      email,
    })
    if (userExists)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Username or email already exists',
      })

    return this._db.transaction(async (tx) => {
      const user = await this._userRepo.create({ username, email }, tx)
      if (!user)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        })

      const provider = 'credentials'
      const password = await this._password.hash(data.password)
      const account = await this._accountRepo.create(
        { userId: user.id, provider, accountId: user.id, password },
        tx,
      )
      if (!account)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create account',
        })

      return { id: user.id }
    })
  }

  async changePassword(
    userId: string,
    data: AuthValidator.ChangePasswordBody,
  ): Promise<{ id: string }> {
    const { currentPassword, newPassword, isLogOutOtherSessions } = data

    const account = await this._accountRepo.findByAccountIdAndProvider({
      accountId: userId,
      provider: 'credentials',
    })

    const provider = 'credentials'

    return this._db.transaction(async (tx) => {
      if (!account) {
        const newPasswordHash = await this._password.hash(newPassword)
        const newAccount = await this._accountRepo.create(
          { userId, provider, accountId: userId, password: newPasswordHash },
          tx,
        )
        if (!newAccount)
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to add password to account',
          })

        if (isLogOutOtherSessions) await invalidateSessionTokens(userId)
        return { id: userId }
      }

      if (!account.password)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Account does not have a password set',
        })

      if (!currentPassword)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Current password is required to change password',
        })

      if (!(await this._password.verify(account.password, currentPassword)))
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Current password is incorrect',
        })

      if (await this._password.verify(account.password, newPassword))
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'New password must be different from the current password',
        })

      const newPasswordHash = await this._password.hash(newPassword)
      const updatedAccount = await this._accountRepo.update(
        account.id,
        { password: newPasswordHash },
        tx,
      )
      if (!updatedAccount) throw new Error('Failed to change password')

      if (isLogOutOtherSessions) await invalidateSessionTokens(userId)
      return { id: userId }
    })
  }
}
