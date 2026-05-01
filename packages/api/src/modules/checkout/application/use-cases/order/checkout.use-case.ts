import type { Database } from '@yukinu/db/drizzle'

import { TRPCError } from '@trpc/server'
import { SHIPPING_COST, TAX_RATE } from '@yukinu/lib/constants'

import type { CheckoutDto } from '@/modules/checkout/application/dtos/order/checkout.dto'
import type { OrderItemRepository } from '@/modules/checkout/domain/repositories/order-item.repository'
import type { OrderRepository } from '@/modules/checkout/domain/repositories/order.repository'
import type { PaymentRepository } from '@/modules/finance/domain/repositories/payment.repository'
import type { CartItemRepository } from '@/modules/sales/domain/repositories/cart-item.repository'
import type { VoucherRepository } from '@/modules/sales/domain/repositories/voucher.repository'

import { OrderItemEntity } from '@/modules/checkout/domain/entities/order-item.entity'
import { OrderEntity } from '@/modules/checkout/domain/entities/order.entity'
import { PaymentEntity } from '@/modules/finance/domain/entities/payment.entity'
import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class CheckoutUseCase extends AbstractUseCase<
  CheckoutDto.Input,
  CheckoutDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _cartItemRepo: CartItemRepository,
    private readonly _orderRepo: OrderRepository,
    private readonly _orderItemRepo: OrderItemRepository,
    private readonly _paymentRepo: PaymentRepository,
    private readonly _voucherRepo: VoucherRepository,
  ) {
    super()
  }

  public async execute(input: CheckoutDto.Input): Promise<CheckoutDto.Output> {
    const { userId, addressId, voucherId, paymentMethod } = input

    const cartItems = await this._cartItemRepo.findWithProduct([{ userId }])
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

      const payment = new PaymentEntity({
        amount: amount.toFixed(2),
        method: paymentMethod,
      })
      await this._paymentRepo.save(payment, tx)

      const orderPromises = ordersData.map(
        async ({ vendorId, items, totalAmount }) => {
          const order = new OrderEntity({
            userId,
            vendorId,
            paymentId: payment.id,
            addressId,
            totalAmount: totalAmount.toFixed(2),
          })
          await this._orderRepo.save(order, tx)

          await this._orderItemRepo.saveMany(
            items.map(
              ({ productId, productVariantId, productPrice, quantity }) =>
                new OrderItemEntity({
                  orderId: order.id,
                  productId,
                  productVariantId,
                  unitPrice: productPrice,
                  quantity,
                }),
            ),
            tx,
          )

          return order.id
        },
      )

      const [orderIds] = await Promise.all([
        Promise.all(orderPromises),
        this._cartItemRepo.delete([{ userId }], tx),
      ])

      return { orderIds }
    })
  }

  private async _applyVoucher(
    voucherId: string | null,
  ): Promise<string | number | null> {
    let discount: string | number | null = null

    if (voucherId) {
      const [voucher] = await this._voucherRepo.find(
        [{ id: voucherId }],
        {},
        { limit: 1 },
      )

      if (!voucher)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Voucher not found.',
        })

      if (voucher.expiredAt < new Date())
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

