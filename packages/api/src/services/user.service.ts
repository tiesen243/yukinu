import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db/types'
import type { UserValidator } from '@yukinu/validators/user'

import type { IProfileRepository } from '../contracts/repositories/profile.repository'
import type { IUserRepository } from '../contracts/repositories/user.repository'
import type { IUserService } from '../contracts/services/user.service'

export class UserService implements IUserService {
  constructor(
    private readonly _db: Database,
    private readonly _profileRepo: IProfileRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  async getUsers(
    query: UserValidator.FindByQueryWithPaginationQuery,
  ): Promise<IUserRepository.FindByQueryWithPaginationResult> {
    const users = await this._userRepo.findByQueryWithPagination(query)
    return users
  }

  async getUserProfile(user: {
    id: IUserRepository.UserType['id']
  }): Promise<IUserRepository.FindByIdWithProfileResult> {
    const profile = await this._userRepo.findByIdWithProfile(user.id)
    return profile
  }

  async updateUser(
    data: UserValidator.UpdateUserBody,
    actingUser: UserValidator.User,
  ): Promise<{ id: IUserRepository.UserType['id'] }> {
    const user = await this._userRepo.find(data.userId)
    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    const isSelf = actingUser.id === data.userId
    const isAdmin = actingUser.role === 'admin'
    const isModerator = actingUser.role === 'moderator'
    if (
      (!isSelf && !isAdmin && !isModerator) ||
      (isModerator && user.role === 'admin' && !isSelf)
    )
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to update this user',
      })

    return this._db.transaction(async (tx) => {
      try {
        const updatedUser = await this._userRepo.update(data.userId, data, tx)
        if (!updatedUser) throw new Error('Failed to update user')
        return updatedUser
      } catch (error) {
        tx.rollback()
        console.error('Transaction error:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error ? error.message : 'Failed to update user',
        })
      }
    })
  }

  async updateUserProfile(
    userId: IUserRepository.UserType['id'],
    data: UserValidator.UpdateProfileBody,
  ): Promise<{ id: IUserRepository.UserType['id'] }> {
    const profile = await this._profileRepo.find(userId)
    if (!profile)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' })

    return this._db.transaction(async (tx) => {
      try {
        const updatedProfile = await this._profileRepo.update(userId, data, tx)
        if (!updatedProfile) throw new Error('Failed to update profile')
        return updatedProfile
      } catch (error) {
        tx.rollback()
        console.error('Transaction error:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error ? error.message : 'Failed to update profile',
        })
      }
    })
  }
}
