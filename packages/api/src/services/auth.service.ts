import { TRPCError } from '@trpc/server'

import type { db } from '@yukinu/db'
import type { AuthModel } from '@yukinu/validators/auth'

import { AccountRepository } from '../repositories/account.repository'
import { ProfileRepository } from '../repositories/profile.repository'
import { UserRepository } from '../repositories/user.repository'

export class AuthService {
  private readonly accountRepo: AccountRepository
  private readonly userRepo: UserRepository
  private readonly profileRepo: ProfileRepository

  constructor(private readonly _db: typeof db) {
    this.accountRepo = new AccountRepository(this._db)
    this.userRepo = new UserRepository(this._db)
    this.profileRepo = new ProfileRepository(this._db)
  }

  async register(data: AuthModel.RegisterBody) {
    const userExists = await this.userRepo.findByIndentifier(
      data.username,
      data.email,
    )
    if (userExists)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Username or email already exists',
      })

    return this._db.transaction(async (tx) => {
      const user = await this.userRepo
        .setTransaction(tx)
        .create(data.username, data.email)
      if (!user)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        })

      const accountResult = await this.accountRepo
        .setTransaction(tx)
        .create(user.id, 'credentials', user.id, data.password)
      if (!accountResult)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create account',
        })

      const profileResult = await this.profileRepo
        .setTransaction(tx)
        .create(user.id, user.username)
      if (!profileResult)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create profile',
        })

      return user
    })
  }
}
