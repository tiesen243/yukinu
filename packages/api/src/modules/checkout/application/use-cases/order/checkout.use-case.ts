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
    if (cartItems.length === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Your cart is empty.',
      })
    }

    const cartItemsByVendor = Object.groupBy(
      cartItems,
      ({ product: { vendorId } }) => vendorId ?? 'unknown',
    )

    return this._db.transaction(async (tx) => {
      const voucher = await this._applyAndConsumeVoucher(voucherId, tx)

      let totalSubtotal = 0
      const vendorsOrdersPlan = Object.entries(cartItemsByVendor).flatMap(
        ([vendorId, items]) => {
          if (vendorId === 'unknown' || !items || items.length === 0) return []

          const vendorSubtotal = items.reduce(
            (sum, item) => sum + Number(item.product.price) * item.quantity,
            0,
          )
          totalSubtotal += vendorSubtotal

          return [{ vendorId, items, vendorSubtotal }]
        },
      )

      let discount = 0
      if (voucher?.discountAmount)
        discount += Number.parseFloat(voucher.discountAmount)
      else if (voucher?.discountPercentage)
        discount += (voucher.discountPercentage / 100) * totalSubtotal

      const amountAfterDiscount = Math.max(totalSubtotal - discount, 0)
      const grossAmount =
        amountAfterDiscount + amountAfterDiscount * TAX_RATE + SHIPPING_COST

      const payment = new PaymentEntity({
        amount: Math.max(grossAmount, 0).toFixed(2),
        voucherId: voucherId ?? null,
        method: paymentMethod,
      })
      await this._paymentRepo.save(payment, tx)

      const orderIds: number[] = []

      for (const { vendorId, items, vendorSubtotal } of vendorsOrdersPlan) {
        const order = new OrderEntity({
          userId,
          vendorId,
          paymentId: payment.id,
          addressId,
          totalAmount: vendorSubtotal.toFixed(2),
        })

        const orderId = await this._orderRepo.save(order, tx)
        orderIds.push(orderId ?? 0)

        const orderItems = items.map(
          ({ productId, productVariantId, product, quantity }) =>
            new OrderItemEntity({
              orderId,
              productId,
              productVariantId,
              unitPrice: product.price,
              quantity,
            }),
        )

        await this._orderItemRepo.saveMany(orderItems, tx)
      }

      await this._cartItemRepo.delete([{ userId }], tx)
      return { orderIds, paymentId: payment.id }
    })
  }

  /**
   * Validates and updates the voucher securely within the active transaction
   * context.
   */
  private async _applyAndConsumeVoucher(
    voucherId: string | null,
    tx: Database,
  ): Promise<{
    discountAmount: string | null
    discountPercentage: number | null
  } | null> {
    if (!voucherId) return null

    const [voucher] = await this._voucherRepo.find(
      [{ id: voucherId }],
      {},
      { limit: 1 },
      tx,
    )

    if (!voucher) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Voucher not found.',
      })
    }

    if (voucher.expiredAt < new Date()) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Voucher has expired.',
      })
    }

    if (voucher.quantity <= 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Voucher is no longer available.',
      })
    }

    const updatedVoucher = voucher.clone({ quantity: voucher.quantity - 1 })
    await this._voucherRepo.save(updatedVoucher, tx)

    return {
      discountAmount: voucher.discountAmount,
      discountPercentage: voucher.discountPercentage,
    }
  }
}
