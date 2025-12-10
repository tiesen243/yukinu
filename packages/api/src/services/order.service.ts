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
    const { and, eq, isNotNull, min, sql } = this._orm
    const {
      addresses,
      orderItems,
      orders,
      productImages,
      productVariants,
      products,
      transactions,
      variantOptions,
      variants,
      vendors,
      vouchers,
    } = this._schema
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

    const [order] = await this._db
      .select({
        id: orders.id,
        userId: orders.userId,
        status: orders.status,
        totalAmount: orders.totalAmount,
        address: {
          recipientName: addresses.recipientName,
          phoneNumber: addresses.phoneNumber,
          street: addresses.street,
          city: addresses.city,
          state: addresses.state,
          postalCode: addresses.postalCode,
          country: addresses.country,
        },
        transaction: {
          id: transactions.id,
          amount: transactions.amount,
          method: transactions.method,
          status: transactions.status,
          updatedAt: transactions.updatedAt,
        },
        voucher: {
          code: vouchers.code,
          discountAmount: vouchers.discountAmount,
          discountPercentage: vouchers.discountPercentage,
        },
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)
      .leftJoin(addresses, eq(addresses.id, orders.addressId))
      .leftJoin(vouchers, eq(vouchers.id, orders.voucherId))
      .leftJoin(transactions, eq(transactions.orderId, orders.id))
    if (!order)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Order not found.',
      })

    const variantData = this._db
      .select({
        variant: sql<
          Record<string, string>
        >`jsonb_object_agg(${variants.name}, ${variantOptions.value})`.as(
          'variant',
        ),
      })
      .from(variantOptions)
      .leftJoin(variants, eq(variants.id, variantOptions.variantId))
      .where(
        and(
          isNotNull(productVariants.sku),
          sql`${variantOptions.id} = ANY(string_to_array(${productVariants.sku}, '-')::int[])`,
        ),
      )
      .as('variant_data')

    const items = await this._db
      .select({
        id: orderItems.id,
        vendorId: vendors.id,
        productId: products.id,
        productName: products.name,
        productImage: min(productImages.url),
        productVariantId: productVariants.id,
        unitPrice: orderItems.unitPrice,
        quantity: orderItems.quantity,
        stock: products.stock,
        variantStock: productVariants.stock,
        variant: sql<
          Record<string, string>
        >`COALESCE(${variantData.variant}, '{}'::jsonb)`.as('variant'),
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .leftJoin(products, eq(products.id, orderItems.productId))
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .leftJoin(
        productVariants,
        eq(productVariants.id, orderItems.productVariantId),
      )
      .leftJoinLateral(variantData, sql`TRUE`)
      .leftJoin(vendors, eq(vendors.id, orderItems.vendorId))
      .where(eq(orders.id, orderId))
      .groupBy(
        orderItems.id,
        products.id,
        productVariants.id,
        variantData.variant,
      )

    return { ...order, items }
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
    const { isNotNull, isNull } = this._orm
    const { orderItems } = this._schema
    const { userId, vendorId, productId, variantId, unitPrice, quantity } =
      input

    return this._db.transaction(async (tx) => {
      const cartId = await this._getUserCart(userId, tx)

      await tx
        .insert(orderItems)
        .values({
          orderId: cartId,
          vendorId,
          productId,
          productVariantId: variantId ?? null,
          unitPrice,
          quantity,
        })
        .onConflictDoUpdate({
          target: variantId
            ? [orderItems.orderId, orderItems.productVariantId]
            : [orderItems.orderId, orderItems.productId],
          targetWhere: variantId
            ? isNotNull(orderItems.productVariantId)
            : isNull(orderItems.productVariantId),
          set: { quantity, unitPrice },
        })
    })
  }

  async removeItemFromCart(
    input: OrderValidators.RemoveItemFromCartInput,
  ): Promise<OrderValidators.RemoveItemFromCartOutput> {
    const { and, eq } = this._orm
    const { orderItems } = this._schema
    const { itemId, userId } = input

    return this._db.transaction(async (tx) => {
      const cartId = await this._getUserCart(userId, tx)
      const [result] = await tx
        .delete(orderItems)
        .where(and(eq(orderItems.orderId, cartId), eq(orderItems.id, itemId)))
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
