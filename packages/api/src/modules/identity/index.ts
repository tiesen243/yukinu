import type { TRPCRouterRecord } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { UseCases } from '@/modules/identity/types'

import { SignInUseCase } from '@/modules/identity/application/use-cases/sign-in.use-case'
import { SignUpUseCase } from '@/modules/identity/application/use-cases/sign-up.use-case'
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
    signIn: new SignInUseCase(),
    signUp: new SignUpUseCase(
      db,
      accountRepo,
      profileRepo,
      userRepo,
      verificationRepo,
    ),
  } satisfies UseCases

  return {
    useCases,
    router: {
      auth: authRouter(useCases),
    } satisfies TRPCRouterRecord,
  }
}
