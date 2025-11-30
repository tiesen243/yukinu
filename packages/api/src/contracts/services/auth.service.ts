import type { AuthValidators } from '@yukinu/validators/auth'

export interface IAuthService {
  register(
    input: AuthValidators.RegisterInput,
  ): Promise<AuthValidators.RegisterOutput>

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
