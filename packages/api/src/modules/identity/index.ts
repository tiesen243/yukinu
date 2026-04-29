import type { TRPCRouterRecord } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { UseCases } from '@/modules/identity/types'

import { ForgotPasswordUseCase } from '@/modules/identity/application/use-cases/forgot-password.use-case'
import { ResetPasswordUseCase } from '@/modules/identity/application/use-cases/reset-password.use-case'
import { SignInUseCase } from '@/modules/identity/application/use-cases/sign-in.use-case'
import { SignUpUseCase } from '@/modules/identity/application/use-cases/sign-up.use-case'
import { VerifyEmailUseCase } from '@/modules/identity/application/use-cases/verify-email.use-case'
import { DrizzleAccountRepository } from '@/modules/identity/infrastructures/drizzle/account.repository'
import { DrizzleProfileRepository } from '@/modules/identity/infrastructures/drizzle/profile.repository'
import { DrizzleUserRepository } from '@/modules/identity/infrastructures/drizzle/user.repository'
import { DrizzleVerificationRepository } from '@/modules/identity/infrastructures/drizzle/verification.repository'
import { authRouter } from '@/modules/identity/interfaces/auth.router'

export const createIdentityModule = (db: Database) => {
  const accountRepo = new DrizzleAccountRepository(db)
  const profileRepo = new DrizzleProfileRepository(db)
  const userRepo = new DrizzleUserRepository(db)
  const verificationRepo = new DrizzleVerificationRepository(db)

  const useCases = {
    forgotPassword: new ForgotPasswordUseCase(db, userRepo, verificationRepo),
    resetPassword: new ResetPasswordUseCase(db, accountRepo, verificationRepo),
    signIn: new SignInUseCase(db),
    signUp: new SignUpUseCase(
      db,
      accountRepo,
      profileRepo,
      userRepo,
      verificationRepo,
    ),
    verifyEmail: new VerifyEmailUseCase(db, userRepo, verificationRepo),
  } satisfies UseCases

  return {
    useCases,
    router: {
      auth: authRouter(useCases),
    } satisfies TRPCRouterRecord,
  }
}
