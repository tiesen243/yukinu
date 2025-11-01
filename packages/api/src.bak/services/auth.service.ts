import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db'
import type { AuthModel } from '@yukinu/validators/auth'
import { invalidateSessionTokens, Password } from '@yukinu/auth'

import type { IAccountRepository } from '../repositories/account'
import type { IProfileRepository } from '../repositories/profile'
import type { IUserRepository } from '../repositories/user'

export class AuthService {
  private readonly _password: Password

  constructor(
    private readonly _db: Database,
    private readonly _accountRepo: IAccountRepository,
    private readonly _profileRepo: IProfileRepository,
    private readonly _userRepo: IUserRepository,
  ) {
    this._password = new Password()
  }

  async register(data: AuthModel.RegisterBody): Promise<{ id: string }> {
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

      const password = await this._password.hash(data.password)
      const provider = 'credentials'
      const account = await this._accountRepo.create(
        { userId: user.id, provider, accountId: user.id, password },
        tx,
      )
      if (!account)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create account',
        })

      const profile = await this._profileRepo.create(
        { id: user.id, fullName: username },
        tx,
      )
      if (!profile)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create profile',
        })

      return user
    })
  }

  async changePassword(
    userId: string,
    data: AuthModel.ChangePasswordBody,
  ): Promise<{ userId: string }> {
    const newPassword = await this._password.hash(data.newPassword)
    const account = await this._accountRepo.findByIdAndProvider(
      userId,
      'credentials',
    )

    let result: { userId: string } | null = null
    if (!account?.password)
      result = await this._accountRepo.create({
        userId,
        provider: 'credentials',
        accountId: userId,
        password: newPassword,
      })
    else {
      if (!data.currentPassword)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Current password is required',
        })

      const isCurrentPasswordValid = await this._password.verify(
        account.password,
        data.currentPassword,
      )
      if (!isCurrentPasswordValid)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Current password is incorrect',
        })

      if (data.currentPassword === data.newPassword)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'New password must be different from current password',
        })

      result = await this._accountRepo.updatePassword(userId, newPassword)
    }

    if (!result)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to change password',
      })

    if (data.isLogOutOtherSessions) await invalidateSessionTokens(userId)

    return result
  }
}
