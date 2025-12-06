import type { SessionWithUser } from '@yukinu/auth'
import type { AuthValidators } from '@yukinu/validators/auth'

export interface IAuthService {
  getCurrentUser(
    userId: NonNullable<SessionWithUser['user']>['id'],
  ): Promise<SessionWithUser>

  register(
    input: AuthValidators.RegisterInput,
  ): Promise<AuthValidators.RegisterOutput>

  verifyEmail(
    input: AuthValidators.VerifyEmailInput,
  ): Promise<AuthValidators.VerifyEmailOutput>

  allSessions(
    input: AuthValidators.AllSessionsInput,
  ): Promise<AuthValidators.AllSessionsOutput>

  deleteSession(
    input: AuthValidators.DeleteSessionInput,
  ): Promise<AuthValidators.DeleteSessionOutput>

  changeUsername(
    input: AuthValidators.ChangeUsernameInput,
  ): Promise<AuthValidators.ChangeUsernameOutput>

  deleteAccount(
    input: AuthValidators.DeleteAccountInput,
  ): Promise<AuthValidators.DeleteAccountOutput>

  changePassword(
    input: AuthValidators.ChangePasswordInput,
  ): Promise<AuthValidators.ChangePasswordOutput>

  forgotPassword(
    input: AuthValidators.ForgotPasswordInput,
  ): Promise<AuthValidators.ForgotPasswordOutput>

  resetPassword(
    input: AuthValidators.ResetPasswordInput,
  ): Promise<AuthValidators.ResetPasswordOutput>
}
