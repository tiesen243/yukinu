import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db'

import type { IProfileRepository } from '../repositories/profile'
import type { IUserRepository } from '../repositories/user'

export class UserService {
  constructor(
    private readonly _db: Database,
    private readonly _profileRepo: IProfileRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  async getUserInfo(userId: string) {
    const profile = await this._profileRepo.findById(userId)
    if (!profile)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    return profile
  }
}
