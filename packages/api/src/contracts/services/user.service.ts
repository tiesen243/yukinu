import type { UserValidators } from '@yukinu/validators/user'

export interface IUserService {
  updateStatus(
    input: UserValidators.UpdateStatusInput,
  ): Promise<UserValidators.UpdateStatusOutput>

  getProfile(
    input: UserValidators.GetProfileInput,
  ): Promise<UserValidators.GetProfileOutput>

  updateProfile(
    input: UserValidators.UpdateProfileInput,
  ): Promise<UserValidators.UpdateProfileOutput>

  getAddresses(
    input: UserValidators.GetAddressesInput,
  ): Promise<UserValidators.GetAddressesOutput>

  getAddress(
    input: UserValidators.GetAddressInput,
  ): Promise<UserValidators.GetAddressOutput>

  createAddress(
    input: UserValidators.CreateAddressInput,
  ): Promise<UserValidators.CreateAddressOutput>

  updateAddress(
    input: UserValidators.UpdateAddressInput,
  ): Promise<UserValidators.UpdateAddressOutput>

  deleteAddress(
    input: UserValidators.DeleteAddressInput,
  ): Promise<UserValidators.DeleteAddressOutput>

  getWishlist(
    input: UserValidators.GetWishlistInput,
  ): Promise<UserValidators.GetWishlistOutput>

  toggleWishlistItem(
    input: UserValidators.ToggleWishlistItemInput,
  ): Promise<UserValidators.ToggleWishlistItemOutput>
}
