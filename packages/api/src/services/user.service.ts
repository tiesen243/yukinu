import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db/types'
import type { UserValidator } from '@yukinu/validators/user'

import type { IProfileRepository, IUserRepository, IUserService } from '@/types'

export class UserService implements IUserService {
  constructor(
    private readonly _db: Database,
    private readonly _profileRepo: IProfileRepository,
    private readonly _userRepo: IUserRepository,
  ) {}

  async getUsers(query: UserValidator.FindByQueryWithPaginationQuery): Promise<{
    users: IUserRepository.UserType[]
    pagination: { page: number; total: number; totalPages: number }
  }> {
    const { search, page, limit } = query
    const offset = (page - 1) * limit

    const criteria = search
      ? [{ username: `%${search}%` }, { email: `%${search}%` }]
      : []
    const orderBy = { createdAt: 'desc' as const }

    const users = await this._userRepo.findBy(criteria, orderBy, limit, offset)
    const total = await this._userRepo.count(criteria)
    const totalPages = Math.ceil(total / limit)

    return { users, pagination: { page, total, totalPages } }
  }

  async getUserProfile(user: {
    id: IUserRepository.UserType['id']
  }): Promise<IUserRepository.UserWithProfile> {
    const profile = await this._userRepo.findWithProfile(user.id)
    if (!profile)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' })
    return profile
  }

  async updateUser(
    data: UserValidator.UpdateUserBody,
    actingUser: UserValidator.User,
  ): Promise<{ id: IUserRepository.UserType['id'] }> {
    const user = await this._userRepo.find(data.userId)
    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    if (actingUser.id === data.userId)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You cannot update yourself',
      })

    const isAdmin = actingUser.role === 'admin'
    const isModerator = actingUser.role === 'moderator'
    if ((!isAdmin && !isModerator) || (isModerator && user.role === 'admin'))
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to update this user',
      })

    return this._db.transaction(async (tx) => {
      const updatedUser = await this._userRepo.update(data.userId, data, tx)
      if (!updatedUser)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user',
        })
      return updatedUser
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
      const updatedProfile = await this._profileRepo.update(userId, data, tx)
      if (!updatedProfile)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile',
        })
      return updatedProfile
    })
  }
}
