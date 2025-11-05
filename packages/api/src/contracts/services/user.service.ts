import type { UserValidator } from '@yukinu/validators/user'

import type { IUserRepository } from '@/types'

export interface IUserService {
  /**
   * Get a list of users with pagination
   * @param query - The query parameters for searching and pagination
   * @returns A list of users and pagination info
   */
  getUsers(query: UserValidator.FindByQueryWithPaginationQuery): Promise<{
    users: IUserRepository.UserType[]
    pagination: { page: number; total: number; totalPages: number }
  }>

  /**
   * Get the profile of a user
   * @param user - The user object containing the user ID
   * @returns The user's profile
   */
  getUserProfile(user: {
    id: IUserRepository.UserType['id']
  }): Promise<IUserRepository.UserWithProfile>

  /**
   * Update a user's information
   * @param data - The data to update the user with
   * @param actingUser - The user performing the update
   * @returns The ID of the updated user
   */
  updateUser(
    data: UserValidator.UpdateUserBody,
    actingUser: UserValidator.User,
  ): Promise<{ id: IUserRepository.UserType['id'] }>

  /**
   * Update a user's profile
   * @param userId - The ID of the user whose profile is to be updated
   * @param data - The data to update the profile with
   * @returns The ID of the user whose profile was updated
   */
  updateUserProfile(
    userId: IUserRepository.UserType['id'],
    data: UserValidator.UpdateProfileBody,
  ): Promise<{ id: IUserRepository.UserType['id'] }>
}
