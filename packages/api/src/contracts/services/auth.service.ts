import type { AuthValidators } from '@yukinu/validators/auth'

export interface IAuthService {
  getCurrentUser(userId: AuthValidators.UsersSchema['id']): Promise<
    Omit<AuthValidators.SessionSchema, 'id' | 'userId' | 'createdAt'> & {
      user: Pick<
        AuthValidators.UsersSchema,
        'id' | 'username' | 'email' | 'role' | 'image'
      >
    }
  >

  register(
    input: AuthValidators.RegisterInput,
  ): Promise<AuthValidators.RegisterOutput>

  verifyEmail(
    input: AuthValidators.VerifyEmailInput,
  ): Promise<AuthValidators.VerifyEmailOutput>

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
