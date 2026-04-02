import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/cart'

import type { ICartItemRepository } from '@/contracts/repositories/cart-item.repository'
import type { ICartService } from '@/contracts/services/cart.service'

export class CartService implements ICartService {
  constructor(
    private readonly _db: Database,
    private readonly _cartItem: ICartItemRepository,
  ) {}

  async get(input: Validators.GetInput): Promise<Validators.GetOutput> {
    const { userId } = input

    const cartItems = await this._cartItem.allWithProduct([{ userId }], {
      productId: 'asc',
    })

    const totalAmount = cartItems
      .reduce(
        (acc, { productPrice, quantity }) =>
          acc + (productPrice ? Number.parseFloat(productPrice) * quantity : 0),
        0,
      )
      .toFixed(2)

    return {
      items: cartItems,
      totalAmount,
    }
  }

  addItemToCart(
    input: Validators.AddItemToCartInput,
  ): Promise<Validators.AddItemToCartOutput> {
    return this._cartItem.create(input)
  }

  async removeItemFromCart(
    input: Validators.RemoveItemFromCartInput,
  ): Promise<Validators.RemoveItemFromCartOutput> {
    const { userId, itemId } = input
    await this._cartItem.deleteMany([{ id: itemId, userId }])
    return itemId
  }
}
