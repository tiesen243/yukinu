import type * as Validators from '@yukinu/validators/general'

export interface IWishlistService {
  get(
    input: Validators.AllWishlistItemsInput,
  ): Promise<Validators.AllWishlistItemsOutput>

  toggleItem(
    input: Validators.ToggleWishlistItemInput,
  ): Promise<Validators.ToggleWishlistItemOutput>
}
