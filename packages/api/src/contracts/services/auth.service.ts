import type * as Validators from '@yukinu/validators/auth'

export interface IAuthService {
  getCurrentUser(userId: Validators.UserSchema['id']): Promise<
    Omit<Validators.SessionSchema, 'id' | 'userId' | 'createdAt'> & {
      user: Pick<
        Validators.UserSchema,
        'id' | 'username' | 'email' | 'role' | 'image'
      >
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
