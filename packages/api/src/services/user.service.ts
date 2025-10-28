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

  async updateUser(
    data: UserModel.UpdateUserBody,
    actingUser: Pick<UserModel.User, 'id' | 'role' | 'status'>,
  ) {
    const { userId, role, status } = data

    const user = await this._userRepo.findById(userId)
    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    if (actingUser.id === userId)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Users cannot change their own role or status',
      })

    if (actingUser.role === 'manager' && user.role === 'admin')
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Managers cannot change the role or status of an admin',
      })

    if (user.role === 'admin' && role !== 'admin') {
      const adminCount = await this._userRepo.countUsersByField('role', 'admin')
      if (adminCount <= 1)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'There must be at least one admin user',
        })
    }

    const updatedUser = await this._userRepo.update(userId, { role, status })
    if (!updatedUser)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update user',
      })
    return updatedUser
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
