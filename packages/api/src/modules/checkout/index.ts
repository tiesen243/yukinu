import type { TRPCRouterRecord } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { UseCases } from '@/modules/checkout/types'
import type { PaymentRepository } from '@/modules/finance/domain/repositories/payment.repository'
import type { CartItemRepository } from '@/modules/sales/domain/repositories/cart-item.repository'
import type { VoucherRepository } from '@/modules/sales/domain/repositories/voucher.repository'

import { AllOrdersUseCase } from '@/modules/checkout/application/use-cases/order/all-orders.use-case'
import { CheckoutUseCase } from '@/modules/checkout/application/use-cases/order/checkout.use-case'
import { OneOrderUseCase } from '@/modules/checkout/application/use-cases/order/one-order.use-case'
import { DrizzleOrderItemRepository } from '@/modules/checkout/infrastructures/drizzle/order-item.repository'
import { DrizzleOrderRepository } from '@/modules/checkout/infrastructures/drizzle/order.repository'
import { orderRouter } from '@/modules/checkout/interfaces/order.router'
import type { VendorMiddleware } from '@/modules/merchant/interfaces/vendor.middleware'

export const createCheckoutModule = (
  db: Database,
  deps: {
    cartItemRepo: CartItemRepository
    paymentRepo: PaymentRepository
    voucherRepo: VoucherRepository
    vendorMiddleware: VendorMiddleware
  },
) => {
  const orderItemRepo = new DrizzleOrderItemRepository(db)
  const orderRepo = new DrizzleOrderRepository(db)

  const useCases = {
    order: {
      all: new AllOrdersUseCase(db, orderRepo),
      one: new OneOrderUseCase(db, orderRepo),
      checkout: new CheckoutUseCase(
        db,
        deps.cartItemRepo,
        orderRepo,
        orderItemRepo,
        deps.paymentRepo,
        deps.voucherRepo,
      ),
    },
  } satisfies UseCases

  return {
    useCases,

    router: {
      order: orderRouter(useCases, {
        vendorMiddleware: deps.vendorMiddleware,
      }),
    } satisfies TRPCRouterRecord,
  }
}
