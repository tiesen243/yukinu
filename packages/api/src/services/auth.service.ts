import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db/types'
import type { AuthValidator } from '@yukinu/validators/auth'
import { Password } from '@yukinu/auth'
import { DrizzleError } from '@yukinu/db'

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
      try {
        const user = await this._userRepo.create({ username, email }, tx)
        if (!user) throw new Error('Failed to create user')

        const provider = 'credentials'
        const password = await this._password.hash(data.password)
        const account = await this._accountRepo.create(
          { userId: user.id, provider, accountId: user.id, password },
          tx,
        )
        if (!account) throw new Error('Failed to create account')

        return { id: user.id }
      } catch (error) {
        tx.rollback()
        console.error('Transaction error:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error && !(error instanceof DrizzleError)
              ? error.message
              : 'Failed to register user',
        })
      }
    })
  }

  async changePassword(
    userId: string,
    data: AuthValidator.ChangePasswordBody,
  ): Promise<{ id: string }> {
    const account = await this._accountRepo.findByAccountIdAndProvider({
      accountId: userId,
      provider: 'credentials',
    })

    const provider = 'credentials'
    const newPassword = await this._password.hash(data.newPassword)

    return this._db.transaction(async (tx) => {
      try {
        if (!account) {
          const newAccount = await this._accountRepo.create(
            { userId, provider, accountId: userId, password: newPassword },
            tx,
          )
          if (!newAccount) throw new Error('Failed to add password to account')
          return { id: newAccount.id }
        }

        if (
          account.password !== null &&
          data.currentPassword &&
          (await this._password.verify(account.password, data.currentPassword))
        )
          throw new Error('Current password is incorrect')

        if (account.password === newPassword)
          throw new Error(
            'New password must be different from the current password',
          )

        const updatedAccount = await this._accountRepo.update(
          account.id,
          { password: newPassword },
          tx,
        )
        if (!updatedAccount) throw new Error('Failed to change password')

        return { id: updatedAccount.id }
      } catch (error) {
        tx.rollback()
        console.error('Transaction error:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error && !(error instanceof DrizzleError)
              ? error.message
              : 'Failed to change password',
        })
      }
    })
  }
}
