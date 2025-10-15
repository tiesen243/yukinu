import { TRPCError } from '@trpc/server'

import type { db } from '@yukinu/db'
import type { AuthModel } from '@yukinu/validators/auth'
import { Password } from '@yukinu/auth'

import type { IAccountRepository } from '../repositories/account'
import type { ProfileRepository } from '../repositories/profile.repository'
import type { IUserRepository } from '../repositories/user'

export class AuthService {
  private readonly _password: Password

  constructor(
    private readonly _db: typeof db,
    private readonly _accountRepo: IAccountRepository,
    private readonly _profileRepo: ProfileRepository,
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
      const user = await this._userRepo.create(data, tx)
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
}
