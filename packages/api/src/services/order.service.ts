import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db'
import type { OrderValidators } from '@yukinu/validators/order'

import type { IOrderService } from '@/contracts/services/order.service'
import { BaseService } from '@/services/base.service'

export class OrderService extends BaseService implements IOrderService {
  all(_input: OrderValidators.AllInput): Promise<OrderValidators.AllOutput> {
    throw new Error('Method not implemented.')
  }

  async one(
    input: OrderValidators.OneInput,
  ): Promise<OrderValidators.OneOutput> {
    const { id, userId, status } = input

    let orderId: number
    if (status === 'pending') orderId = await this._getUserCart(userId)
    else if (id) orderId = id
    else
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Either order ID or status "pending" with user ID must be provided.',
      })

    console.log('orderId', orderId)
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
    input: OrderValidators.AddItemToCartInput,
  ): Promise<OrderValidators.AddItemToCartOutput> {
    const { orderItems } = this._schema
    const { userId, productId, variantId, unitPrice, quantity } = input

    return this._db.transaction(async (tx) => {
      const cartId = await this._getUserCart(userId, tx)

      await tx
        .insert(orderItems)
        .values({
          orderId: cartId,
          productId,
          productVariantId: variantId ?? null,
          unitPrice,
          quantity,
        })
        .onConflictDoUpdate({
          target: variantId
            ? [orderItems.orderId, orderItems.productVariantId]
            : [orderItems.orderId, orderItems.productId],
          set: { quantity, unitPrice },
        })
    })
  }

  async removeItemFromCart(
    input: OrderValidators.RemoveItemFromCartInput,
  ): Promise<OrderValidators.RemoveItemFromCartOutput> {
    const { and, eq } = this._orm
    const { orderItems } = this._schema
    const { userId, itemId } = input

    return this._db.transaction(async (tx) => {
      const cartId = await this._getUserCart(userId, tx)

      const [result] = await tx
        .delete(orderItems)
        .where(
          and(eq(orderItems.orderId, cartId), eq(orderItems.productId, itemId)),
        )
        .returning({ id: orderItems.productId })
      if (!result)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Item not found in cart.',
        })
    })
  }

  private async _getUserCart(
    userId: OrderValidators.OneInput['userId'],
    tx: Database = this._db,
  ): Promise<number> {
    const { and, eq } = this._orm
    const { orders } = this._schema

    if (!userId)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User ID is required to get the cart.',
      })

    let [cart] = await tx
      .select({ id: orders.id })
      .from(orders)
      .where(and(eq(orders.userId, userId), eq(orders.status, 'pending')))
    if (!cart)
      [cart] = await tx
        .insert(orders)
        .values({ userId, status: 'pending' })
        .returning({ id: orders.id })

    if (!cart?.id)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create or retrieve the cart.',
      })

    return cart.id
  }
}
