import type { SignInUseCase } from '@/modules/identity/application/use-cases/sign-in.use-case'
import type { SignUpUseCase } from '@/modules/identity/application/use-cases/sign-up.use-case'

export interface UseCases {
  signIn: SignInUseCase
  signUp: SignUpUseCase
}
