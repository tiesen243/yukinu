import type { AuthModels } from '@yukinu/validators/auth'

export interface IAuthService {
  /**
   * Login a user
   * @param input - The login data
   * @example
   * {
   *   identifier: 'username-or-email',
   *   password: 'user-password'
   * }
   * @param headers - The request headers
   * @param resHeaders - The response headers
   * @returns The session data
   */
  login(
    input: AuthModels.LoginInput,
    headers: Headers,
    resHeaders: Headers,
  ): Promise<AuthModels.LoginOutput>

  /**
   * Logout a user
   * @param headers - The request headers
   * @param resHeaders - The response headers
   */
  logout(headers: Headers, resHeaders: Headers): Promise<void>

  /**
   * Register a new user
   * @param input - The registration data
   * @example
   * {
   *   username: 'newuser',
   *   email: 'newuser@example.com',
   *   password: 'securepassword',
   *   confirmPassword: 'securepassword'
   * }
   * @returns The ID of the newly created user
   */
  register(input: AuthModels.RegisterInput): Promise<AuthModels.RegisterOutput>

  /**
   * Change the password of a user
   * @param input - The data required to change the password
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
