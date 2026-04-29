import type { ForgotPasswordUseCase } from '@/modules/identity/application/use-cases/auth/forgot-password.use-case'
import type { ResetPasswordUseCase } from '@/modules/identity/application/use-cases/auth/reset-password.use-case'
import type { SignInUseCase } from '@/modules/identity/application/use-cases/auth/sign-in.use-case'
import type { SignUpUseCase } from '@/modules/identity/application/use-cases/auth/sign-up.use-case'
import type { VerifyEmailUseCase } from '@/modules/identity/application/use-cases/auth/verify-email.use-case'
import type { AllUsersUseCase } from '@/modules/identity/application/use-cases/user/all-users.use-case'

export interface UseCases {
  auth: {
    forgotPassword: ForgotPasswordUseCase
    resetPassword: ResetPasswordUseCase
    signIn: SignInUseCase
    signUp: SignUpUseCase
    verifyEmail: VerifyEmailUseCase
  }
  user: {
    allUsers: AllUsersUseCase
  }
}

// Auth DTOs
export { ForgotPasswordDto } from '@/modules/identity/application/dtos/auth/forgot-password.dto'
export { ResetPasswordDto } from '@/modules/identity/application/dtos/auth/reset-password.dto'
export { SignInDto } from '@/modules/identity/application/dtos/auth/sign-in.dto'
export { SignUpDto } from '@/modules/identity/application/dtos/auth/sign-up.dto'
export { VerifyEmailDto } from '@/modules/identity/application/dtos/auth/verify-email.dto'

// User DTOs
export { AllUsersDto } from '@/modules/identity/application/dtos/user/all-users.dto'
