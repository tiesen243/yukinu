import type { AllAddressesUseCase } from '@/modules/identity/application/use-cases/address/all-addresses.use-case'
import type { DeleteAddressUseCase } from '@/modules/identity/application/use-cases/address/delete-address.use-case'
import type { OneAddressUseCase } from '@/modules/identity/application/use-cases/address/one-address.use-case'
import type { SaveAddressUseCase } from '@/modules/identity/application/use-cases/address/save-address.use-case'
import type { ForgotPasswordUseCase } from '@/modules/identity/application/use-cases/auth/forgot-password.use-case'
import type { ResetPasswordUseCase } from '@/modules/identity/application/use-cases/auth/reset-password.use-case'
import type { SignInUseCase } from '@/modules/identity/application/use-cases/auth/sign-in.use-case'
import type { SignUpUseCase } from '@/modules/identity/application/use-cases/auth/sign-up.use-case'
import type { VerifyEmailUseCase } from '@/modules/identity/application/use-cases/auth/verify-email.use-case'
import type { AllUsersUseCase } from '@/modules/identity/application/use-cases/user/all-users.use-case'
import type { DeleteUserUseCase } from '@/modules/identity/application/use-cases/user/delete-user.use-case'
import type { OneUserUseCase } from '@/modules/identity/application/use-cases/user/one-user.use-case'
import type { PermanentlyDeleteUserUseCase } from '@/modules/identity/application/use-cases/user/permanently-delete-user.use-case'
import type { ProfileUseCase } from '@/modules/identity/application/use-cases/user/profile.use-case'
import type { RestoreUserUseCase } from '@/modules/identity/application/use-cases/user/restore-user.use-case'
import type { UpdateProfileUseCase } from '@/modules/identity/application/use-cases/user/update-profile.use-case'
import type { UpdateUserUseCase } from '@/modules/identity/application/use-cases/user/update-user.use-case'

export interface UseCases {
  adddress: {
    all: AllAddressesUseCase
    one: OneAddressUseCase
    save: SaveAddressUseCase
    delete: DeleteAddressUseCase
  }
  auth: {
    forgotPassword: ForgotPasswordUseCase
    resetPassword: ResetPasswordUseCase
    signIn: SignInUseCase
    signUp: SignUpUseCase
    verifyEmail: VerifyEmailUseCase
  }
  user: {
    allUsers: AllUsersUseCase
    deleteUser: DeleteUserUseCase
    oneUser: OneUserUseCase
    permanentlyDeleteUser: PermanentlyDeleteUserUseCase
    profile: ProfileUseCase
    restoreUser: RestoreUserUseCase
    updateProfile: UpdateProfileUseCase
    updateUser: UpdateUserUseCase
  }
}

// Address DTOs
export { AllAddressesDto } from '@/modules/identity/application/dtos/address/all-addresses.dto'
export { OneAddressDto } from '@/modules/identity/application/dtos/address/one-address.dto'
export { SaveAddressDto } from '@/modules/identity/application/dtos/address/save-address.dto'

// Auth DTOs
export { ForgotPasswordDto } from '@/modules/identity/application/dtos/auth/forgot-password.dto'
export { ResetPasswordDto } from '@/modules/identity/application/dtos/auth/reset-password.dto'
export { SignInDto } from '@/modules/identity/application/dtos/auth/sign-in.dto'
export { SignUpDto } from '@/modules/identity/application/dtos/auth/sign-up.dto'
export { VerifyEmailDto } from '@/modules/identity/application/dtos/auth/verify-email.dto'

// User DTOs
export { AllUsersDto } from '@/modules/identity/application/dtos/user/all-users.dto'
export { OneUserDto } from '@/modules/identity/application/dtos/user/one-user.dto'
export { ProfileDto } from '@/modules/identity/application/dtos/user/profile.dto'
export { UpdateProfileDto } from '@/modules/identity/application/dtos/user/update-profile.dto'
export { UpdateUserDto } from '@/modules/identity/application/dtos/user/update-user.dto'
