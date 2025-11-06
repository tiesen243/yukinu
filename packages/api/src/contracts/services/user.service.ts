import type { UserValidator } from '@yukinu/validators/user'

import type { IUserRepository } from '@/types'

export interface IUserService {
  /**
   * Get a list of users with pagination
   * @param query - The query parameters for searching and pagination
   * @returns A list of users and pagination info
   */
  getUsers(query: UserValidator.AllParams): Promise<{
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
   * @example
   * {
   *   userId: 'user-uuid',
   *   role: 'admin',
   *   status: 'active',
   *   password: 'newPassword123' // optional
   * }
   * @param actingUser - The user performing the update
   */
  updateUser(
    data: UserValidator.UpdateUserBody,
    actingUser: UserValidator.User,
  ): Promise<void>

  /**
   * Delete a user
   * @param data - The data containing the user ID to delete
   * @example
   * {
   *   userId: 'user-uuid'
   * }
   * @param actingUser - The user performing the deletion
   */
  deleteUser(
    data: UserValidator.OneParams,
    actingUser: UserValidator.User,
  ): Promise<void>

  /**
   * Update a user's profile
   * @param userId - The ID of the user whose profile is to be updated
   * @param data - The data to update the profile with
   */
  updateUserProfile(
    userId: IUserRepository.UserType['id'],
    data: UserValidator.UpdateProfileBody,
  ): Promise<void>
}
