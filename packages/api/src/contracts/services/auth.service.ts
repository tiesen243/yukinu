import type { AuthModels } from '@yukinu/validators/auth'

export interface IAuthService {
  /**
   * Register a new user
   * @param data - The registration data
   * @returns The ID of the newly created user
   */
  register(input: AuthModels.RegisterInput): Promise<AuthModels.RegisterOutput>

  /**
   * Change the password of a user
   * @param data - The data required to change the password
   * @example
   * {
   *   userId: 'user-id',
   *   currentPassword: 'current-password', // optional if admin
   *   newPassword: 'new-password',
   *   confirmNewPassword: 'new-password',
   *   isLogOutOtherSessions: true
   * }
   * @returns The ID of the user whose password was changed
   */
  changePassword(
    input: AuthModels.ChangePasswordInput,
  ): Promise<AuthModels.ChangePasswordOutput>
}
