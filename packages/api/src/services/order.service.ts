import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/order'

import { TRPCError } from '@trpc/server'
import { SHIPPING_COST, TAX_RATE } from '@yukinu/lib/constants'

import type { ICartItemRepository } from '@/contracts/repositories/cart-item.repository'
import type { IOrderItemRepository } from '@/contracts/repositories/order-item.repository'
import type { IOrderRepository } from '@/contracts/repositories/order.repository'
import type { IPaymentRepository } from '@/contracts/repositories/payment.repository'
import type { IVoucherRepository } from '@/contracts/repositories/voucher.repository'
import type { IOrderService } from '@/contracts/services/order.service'

export class OrderService implements IOrderService {
  constructor(
    private readonly _db: Database,
    private readonly _cartItem: ICartItemRepository,
    private readonly _orderItem: IOrderItemRepository,
    private readonly _order: IOrderRepository,
    private readonly _payment: IPaymentRepository,
    private readonly _voucher: IVoucherRepository,
  ) {}

  async all(input: Validators.AllInput): Promise<Validators.AllOutput> {
    const { userId, vendorId, paymentId, page, limit } = input
    const offset = (page - 1) * limit

    const whereClause = []
    if (userId) whereClause.push({ userId })
    if (vendorId) whereClause.push({ vendorId })
    if (paymentId) whereClause.push({ paymentId })

    const [orders, total] = await Promise.all([
      this._order.allWithItems(
        whereClause,
        { updatedAt: 'desc' },
        { limit, offset },
      ),
      this._order.count(whereClause),
    ])
    const totalPages = Math.ceil(total / limit)

    return { orders, pagination: { total, page, limit, totalPages } }
  }

  async one(input: Validators.OneInput): Promise<Validators.OneOutput> {
    const { id } = input

    const order = await this._order.oneWithDetails(id)

    if (!order)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Order not found.',
      })

    return order
  }

  async checkout(
    input: Validators.CheckoutInput,
  ): Promise<Validators.CheckoutOutput> {
    const { userId, addressId, voucherId, paymentMethod } = input

    const cartItems = await this._cartItem.allWithProduct([{ userId }])
    if (cartItems.length === 0)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Your cart is empty.',
      })

    const cartItemsByVendor = Object.groupBy(
      cartItems,
      ({ vendorId }) => vendorId ?? 'unknown',
    )

    const discount = await this._applyVoucher(voucherId)

    return this._db.transaction(async (tx) => {
      let amount = 0

      const ordersData = Object.entries(cartItemsByVendor).flatMap(
        ([vendorId, items]) => {
          if (vendorId === 'unknown' || !items || items.length === 0) return []

          const totalAmount = items.reduce(
            (sum, item) =>
              sum + Number.parseFloat(item.productPrice) * item.quantity,
            0,
          )
          amount += totalAmount
          return [{ vendorId, items, totalAmount }]
        },
      )

      if (typeof discount === 'string') amount -= Number.parseFloat(discount)
      else if (typeof discount === 'number') amount -= (amount * discount) / 100
      amount += TAX_RATE * Math.max(amount, 0) + SHIPPING_COST

      const paymentId = await this._payment.create(
        { amount: amount.toFixed(2), method: paymentMethod },
        tx,
      )

      const orderPromises = ordersData.map(
        async ({ vendorId, items, totalAmount }) => {
          const orderId = await this._order.create(
            {
              userId,
              vendorId,
              paymentId,
              addressId,
              totalAmount: totalAmount.toFixed(2),
            },
            tx,
          )

          await this._orderItem.createMany(
            items.map(
              ({ productId, productVariantId, productPrice, quantity }) => ({
                orderId,
                productId,
                productVariantId,
                unitPrice: productPrice,
                quantity,
              }),
            ),
            tx,
          )

          return orderId
        },
      )

      const [orderIds] = await Promise.all([
        Promise.all(orderPromises),
        this._cartItem.deleteMany([{ userId }], tx),
      ])

      return { orderIds }
    })
  }

  private async _applyVoucher(
    voucherId: string | null,
  ): Promise<string | number | null> {
    let discount: string | number | null = null

    if (voucherId) {
      const voucher = await this._voucher.find(voucherId)
      if (!voucher)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Voucher not found.',
        })

      if (voucher.expiryDate < new Date())
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Voucher has expired.',
        })

      if (voucher.quantity <= 0)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Voucher is no longer available.',
        })

      if (voucher.discountAmount) discount = voucher.discountAmount
      else if (voucher.discountPercentage) discount = voucher.discountPercentage
    }

    return discount
  }
}
