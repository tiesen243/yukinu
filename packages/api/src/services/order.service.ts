import type { OrderValidators } from '@yukinu/validators/order'

import type { IOrderService } from '@/contracts/services/order.service'
import { BaseService } from '@/services/base.service'

export class OrderService extends BaseService implements IOrderService {
  all(_input: OrderValidators.AllInput): Promise<OrderValidators.AllOutput> {
    throw new Error('Method not implemented.')
  }

  one(input: OrderValidators.OneInput): Promise<OrderValidators.OneOutput> {
    const { userId, status } = input

    if (status === 'pending') return this._getUserCart(userId)
    throw new Error('Method not implemented.')
  }

  checkout(
    _input: OrderValidators.CheckoutInput,
  ): Promise<OrderValidators.CheckoutOutput> {
    throw new Error('Method not implemented.')
  }

  update(
    _input: OrderValidators.UpdateInput,
  ): Promise<OrderValidators.UpdateOutput> {
    throw new Error('Method not implemented.')
  }

  addItemToCart(
    _input: OrderValidators.AddItemToCartInput,
  ): Promise<OrderValidators.AddItemToCartOutput> {
    throw new Error('Method not implemented.')
  }

  updateItemInCart(
    _input: OrderValidators.UpdateItemInCartInput,
  ): Promise<OrderValidators.UpdateItemInCartOutput> {
    throw new Error('Method not implemented.')
  }

  removeItemFromCart(
    _input: OrderValidators.RemoveItemFromCartInput,
  ): Promise<OrderValidators.RemoveItemFromCartOutput> {
    throw new Error('Method not implemented.')
  }

  private _getUserCart(
    _userId: OrderValidators.OneInput['userId'],
  ): Promise<OrderValidators.OneOutput> {
    throw new Error('Method not implemented.')
  }
}
