import type * as Validators from '@yukinu/validators/user'

export interface IUserService {
  all(input: Validators.AllUsersInput): Promise<Validators.AllUsersOutput>

  one(input: Validators.OneUserInput): Promise<Validators.OneUserOutput>

  update(
    input: Validators.UpdateUserInput,
  ): Promise<Validators.UpdateUserOutput>

  delete(
    input: Validators.DeleteUserInput,
  ): Promise<Validators.DeleteUserOutput>

  restore(
    input: Validators.RestoreUserInput,
  ): Promise<Validators.RestoreUserOutput>

  permanentlyDelete(
    input: Validators.PermanentlyDeleteUserInput,
  ): Promise<Validators.PermanentlyDeleteUserOutput>

  profile(input: Validators.ProfileInput): Promise<Validators.ProfileOutput>

  updateProfile(
    input: Validators.UpdateProfileInput,
  ): Promise<Validators.UpdateProfileOutput>
}
