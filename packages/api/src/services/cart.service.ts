import type { IOrderItemRepository } from '@/contracts/repositories/order-item.repository'
import type { IOrderRepository } from '@/contracts/repositories/order.repository'
import type { ICartService } from '@/contracts/services/cart.service'
import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/order'

export class CartService implements ICartService {
  constructor(
    private readonly _db: Database,
    private readonly _orderItem: IOrderItemRepository,
    private readonly _order: IOrderRepository,
  ) {}

  async get(
    input: Validators.OneInput,
  ): Promise<Pick<Validators.OneOutput, 'items' | 'totalAmount'>> {
    const { userId } = input

    const cartId = await this._getCardId(userId)
    const items = await this._orderItem.allWithProduct([{ orderId: cartId }])

    const totalAmount = items
      .reduce(
        (acc, item) => acc + parseFloat(item.unitPrice) * item.quantity,
        0,
      )
      .toFixed(2)

    return {
      items,
      totalAmount,
    }
  }

  async addItemToCart(
    input: Validators.AddItemToCartInput,
  ): Promise<Validators.AddItemToCartOutput> {
    const { userId, variantId, ...data } = input

    const cartId = await this._getCardId(userId)
    const itemId = await this._orderItem.create({
      ...data,
      orderId: cartId,
      productVariantId: variantId ?? null,
    })

    return itemId
  }

  async removeItemFromCart(
    input: Validators.RemoveItemFromCartInput,
  ): Promise<Validators.RemoveItemFromCartOutput> {
    const { userId, itemId } = input

    const cartId = await this._getCardId(userId)
    await this._orderItem.deleteMany([{ id: itemId, orderId: cartId }])

    return itemId
  }

  private async _getCardId(
    userId: Validators.OneInput['userId'],
  ): Promise<Validators.OrderSchema['id']> {
    const [cart] = await this._order.all(
      [{ userId: userId, status: 'pending' }],
      {},
      { limit: 1 },
    )

    let cartId = cart?.id
    if (!cartId)
      cartId = await this._order.create({ userId, status: 'pending' })

    return cartId
  }
}
