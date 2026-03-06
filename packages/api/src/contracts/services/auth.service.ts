import type * as Validators from '@yukinu/validators/auth'

export interface IAuthService {
  getCurrentUser(userId: Validators.UserSchema['id']): Promise<
    Omit<Validators.SessionSchema, 'id' | 'userId' | 'createdAt'> & {
      user: Omit<Validators.UserSchema, 'status' | 'deletedAt'>
    }
  >

  register(input: Validators.RegisterInput): Promise<Validators.RegisterOutput>

  verifyEmail(
    input: Validators.VerifyEmailInput,
  ): Promise<Validators.VerifyEmailOutput>

  forgotPassword(
    input: Validators.ForgotPasswordInput,
  ): Promise<Validators.ForgotPasswordOutput>

  resetPassword(
    input: Validators.ResetPasswordInput,
  ): Promise<Validators.ResetPasswordOutput>
}
