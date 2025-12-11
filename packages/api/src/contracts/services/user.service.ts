import type { UserValidators } from '@yukinu/validators/user'

export interface IUserService {
  all(input: UserValidators.AllInput): Promise<UserValidators.AllOutput>

  one(input: UserValidators.OneInput): Promise<UserValidators.OneOutput>

  update(
    input: UserValidators.UpdateInput,
  ): Promise<UserValidators.UpdateOutput>

  delete(
    input: UserValidators.DeleteInput,
  ): Promise<UserValidators.DeleteOutput>

  restore(
    input: UserValidators.RestoreInput,
  ): Promise<UserValidators.RestoreOutput>

  permanentlyDelete(
    input: UserValidators.PermanentlyDeleteInput,
  ): Promise<UserValidators.PermanentlyDeleteOutput>

  profile(
    input: UserValidators.ProfileInput,
  ): Promise<UserValidators.ProfileOutput>

  updateProfile(
    input: UserValidators.UpdateProfileInput,
  ): Promise<UserValidators.UpdateProfileOutput>

  allAddresses(
    input: UserValidators.AllAddressesInput,
  ): Promise<UserValidators.AllAddressesOutput>

  oneAddress(
    input: UserValidators.OneAddressInput,
  ): Promise<UserValidators.OneAddressOutput>

  createAddress(
    input: UserValidators.CreateAddressInput,
  ): Promise<UserValidators.CreateAddressOutput>

  updateAddress(
    input: UserValidators.UpdateAddressInput,
  ): Promise<UserValidators.UpdateAddressOutput>

  deleteAddress(
    input: UserValidators.DeleteAddressInput,
  ): Promise<UserValidators.DeleteAddressOutput>

  wishlist(
    input: UserValidators.WishlistInput,
  ): Promise<UserValidators.WishlistOutput>

  toggleWishlistItem(
    input: UserValidators.ToggleWishlistItemInput,
  ): Promise<UserValidators.ToggleWishlistItemOutput>
}
