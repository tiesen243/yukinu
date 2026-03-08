import type * as Validators from '@yukinu/validators/cart'

export interface ICartService {
  get(input: Validators.GetInput): Promise<Validators.GetOutput>

  addItemToCart(
    input: Validators.AddItemToCartInput,
  ): Promise<Validators.AddItemToCartOutput>

  removeItemFromCart(
    input: Validators.RemoveItemFromCartInput,
  ): Promise<Validators.RemoveItemFromCartOutput>
}
