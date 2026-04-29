import type { ForgotPasswordUseCase } from '@/modules/identity/application/use-cases/forgot-password.use-case'
import type { ResetPasswordUseCase } from '@/modules/identity/application/use-cases/reset-password.use-case'
import type { SignInUseCase } from '@/modules/identity/application/use-cases/sign-in.use-case'
import type { SignUpUseCase } from '@/modules/identity/application/use-cases/sign-up.use-case'
import type { VerifyEmailUseCase } from '@/modules/identity/application/use-cases/verify-email.use-case'

export interface UseCases {
  forgotPassword: ForgotPasswordUseCase
  resetPassword: ResetPasswordUseCase
  signIn: SignInUseCase
  signUp: SignUpUseCase
  verifyEmail: VerifyEmailUseCase
}

export type { ForgotPasswordDto } from '@/modules/identity/application/dtos/forgot-password.dto'
export type { ResetPasswordDto } from '@/modules/identity/application/dtos/reset-password.dto'
export type { SignInDto } from '@/modules/identity/application/dtos/sign-in.dto'
export type { SignUpDto } from '@/modules/identity/application/dtos/sign-up.dto'
export type { VerifyEmailDto } from '@/modules/identity/application/dtos/verify-email.dto'
