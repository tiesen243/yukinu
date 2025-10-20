import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db'
import type { UserModel } from '@yukinu/validators/user'

import type { IProfileRepository } from '../repositories/profile'
import type { IUserRepository } from '../repositories/user'

export class UserService {
  constructor(
    private readonly _db: Database,
    private readonly _profileRepo: IProfileRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  async getUsers(query: UserModel.FindUsersBySearchWithPaginationQuery) {
    const { search, page, limit } = query
    const users = await this._userRepo.findUsersBySearchWithPagination(
      search,
      page,
      limit,
    )
    return users
  }

  async getUserInfo(user: { id: string }) {
    const profile = await this._userRepo.findUserWithProfileById(user.id)
    if (!profile)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    return { ...user, ...profile }
  }

  async updateUserInfo(userId: string, data: UserModel.UpdateProfileBody) {
    const user = await this._userRepo.findById(userId)
    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    const result = await this._profileRepo.update(userId, data)
    if (!result)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update profile',
      })

    return result
  }
}
