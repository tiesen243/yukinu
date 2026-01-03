import type * as Validators from '@yukinu/validators/order'

export interface ICartService {
  addItemToCart(
    input: Validators.AddItemToCartInput,
  ): Promise<Validators.AddItemToCartOutput>

  removeItemFromCart(
    input: Validators.RemoveItemFromCartInput,
  ): Promise<Validators.RemoveItemFromCartOutput>
}
