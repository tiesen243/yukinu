import type { TRPCRouterRecord } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { UseCases } from '@/modules/identity/types'

import { AllAddressesUseCase } from '@/modules/identity/application/use-cases/address/all-addresses.use-case'
import { DeleteAddressUseCase } from '@/modules/identity/application/use-cases/address/delete-address.use-case'
import { OneAddressUseCase } from '@/modules/identity/application/use-cases/address/one-address.use-case'
import { SaveAddressUseCase } from '@/modules/identity/application/use-cases/address/save-address.use-case'
import { ForgotPasswordUseCase } from '@/modules/identity/application/use-cases/auth/forgot-password.use-case'
import { ResetPasswordUseCase } from '@/modules/identity/application/use-cases/auth/reset-password.use-case'
import { SignInUseCase } from '@/modules/identity/application/use-cases/auth/sign-in.use-case'
import { SignUpUseCase } from '@/modules/identity/application/use-cases/auth/sign-up.use-case'
import { VerifyEmailUseCase } from '@/modules/identity/application/use-cases/auth/verify-email.use-case'
import { AllUsersUseCase } from '@/modules/identity/application/use-cases/user/all-users.use-case'
import { DeleteUserUseCase } from '@/modules/identity/application/use-cases/user/delete-user.use-case'
import { OneUserUseCase } from '@/modules/identity/application/use-cases/user/one-user.use-case'
import { PermanentlyDeleteUserUseCase } from '@/modules/identity/application/use-cases/user/permanently-delete-user.use-case'
import { ProfileUseCase } from '@/modules/identity/application/use-cases/user/profile.use-case'
import { RestoreUserUseCase } from '@/modules/identity/application/use-cases/user/restore-user.use-case'
import { UpdateProfileUseCase } from '@/modules/identity/application/use-cases/user/update-profile.use-case'
import { UpdateUserUseCase } from '@/modules/identity/application/use-cases/user/update-user.use-case'
import { DrizzleAccountRepository } from '@/modules/identity/infrastructures/drizzle/account.repository'
import { DrizzleAddressRepository } from '@/modules/identity/infrastructures/drizzle/address.repository'
import { DrizzleProfileRepository } from '@/modules/identity/infrastructures/drizzle/profile.repository'
import { DrizzleUserRepository } from '@/modules/identity/infrastructures/drizzle/user.repository'
import { DrizzleVerificationRepository } from '@/modules/identity/infrastructures/drizzle/verification.repository'
import { addressRouter } from '@/modules/identity/interfaces/address.router'
import { authRouter } from '@/modules/identity/interfaces/auth.router'
import { userRouter } from '@/modules/identity/interfaces/user.router'

export const createIdentityModule = (db: Database) => {
  const accountRepo = new DrizzleAccountRepository(db)
  const addressRepo = new DrizzleAddressRepository(db)
  const profileRepo = new DrizzleProfileRepository(db)
  const userRepo = new DrizzleUserRepository(db)
  const verificationRepo = new DrizzleVerificationRepository(db)

  const useCases = {
    adddress: {
      all: new AllAddressesUseCase(db, addressRepo),
      one: new OneAddressUseCase(db, addressRepo),
      save: new SaveAddressUseCase(db, addressRepo),
      delete: new DeleteAddressUseCase(db, addressRepo),
    },
    auth: {
      forgotPassword: new ForgotPasswordUseCase(db, userRepo, verificationRepo),
      resetPassword: new ResetPasswordUseCase(
        db,
        accountRepo,
        verificationRepo,
      ),
      signIn: new SignInUseCase(db),
      signUp: new SignUpUseCase(
        db,
        accountRepo,
        profileRepo,
        userRepo,
        verificationRepo,
      ),
      verifyEmail: new VerifyEmailUseCase(db, userRepo, verificationRepo),
    },
    user: {
      allUsers: new AllUsersUseCase(db, userRepo),
      deleteUser: new DeleteUserUseCase(db, userRepo),
      oneUser: new OneUserUseCase(db, userRepo),
      permanentlyDeleteUser: new PermanentlyDeleteUserUseCase(db, userRepo),
      profile: new ProfileUseCase(db, userRepo, profileRepo),
      restoreUser: new RestoreUserUseCase(db, userRepo),
      updateProfile: new UpdateProfileUseCase(db, profileRepo, userRepo),
      updateUser: new UpdateUserUseCase(db, userRepo),
    },
  } satisfies UseCases

  return {
    useCases,
    repos: {
      userRepo,
    },

    router: {
      address: addressRouter(useCases),
      auth: authRouter(useCases),
      user: userRouter(useCases),
    } satisfies TRPCRouterRecord,
  }
}
