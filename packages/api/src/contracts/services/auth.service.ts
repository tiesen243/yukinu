import type { AuthValidator } from '@yukinu/validators/auth'

import type { IUserRepository } from '@/types'

export interface IAuthService {
  /**
   * Register a new user
   * @param data - The registration data
   * @returns The ID of the newly created user
   */
  register(
    data: AuthValidator.RegisterBody,
  ): Promise<{ id: IUserRepository.UserType['id'] }>

  /**
   * Change the password of a user
   * @param userId - The ID of the user whose password is to be changed
   * @param data - The data containing the new password
   * @returns The ID of the user whose password was changed
   */
  changePassword(
    userId: string,
    data: AuthValidator.ChangePasswordBody,
  ): Promise<{ id: IUserRepository.UserType['id'] }>
}
