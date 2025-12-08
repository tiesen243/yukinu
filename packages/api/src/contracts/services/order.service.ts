import type { OrderValidators } from '@yukinu/validators/order'

export interface IOrderService {
  all(input: OrderValidators.AllInput): Promise<OrderValidators.AllOutput>

  one(input: OrderValidators.OneInput): Promise<OrderValidators.OneOutput>

  checkout(
    input: OrderValidators.CheckoutInput,
  ): Promise<OrderValidators.CheckoutOutput>

  update(
    input: OrderValidators.UpdateInput,
  ): Promise<OrderValidators.UpdateOutput>

  addItemToCart(
    input: OrderValidators.AddItemToCartInput,
  ): Promise<OrderValidators.AddItemToCartOutput>

  updateItemInCart(
    input: OrderValidators.UpdateItemInCartInput,
  ): Promise<OrderValidators.UpdateItemInCartOutput>

  removeItemFromCart(
    input: OrderValidators.RemoveItemFromCartInput,
  ): Promise<OrderValidators.RemoveItemFromCartOutput>
}
