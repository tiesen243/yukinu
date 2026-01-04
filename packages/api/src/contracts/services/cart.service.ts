import type * as Validators from '@yukinu/validators/order'

export interface ICartService {
  get(
    input: Validators.OneInput,
  ): Promise<Pick<Validators.OneOutput, 'items' | 'totalAmount'>>

  addItemToCart(
    input: Validators.AddItemToCartInput,
  ): Promise<Validators.AddItemToCartOutput>

  removeItemFromCart(
    input: Validators.RemoveItemFromCartInput,
  ): Promise<Validators.RemoveItemFromCartOutput>
}
