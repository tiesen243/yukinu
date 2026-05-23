import type { AllOrdersUseCase } from '@/modules/checkout/application/use-cases/order/all-orders.use-case'
import type { CheckoutUseCase } from '@/modules/checkout/application/use-cases/order/checkout.use-case'
import type { OneOrderUseCase } from '@/modules/checkout/application/use-cases/order/one-order.use-case'
import type { UpdateOrderStatusUseCase } from '@/modules/checkout/application/use-cases/order/update-order-status'

export interface UseCases {
  order: {
    all: AllOrdersUseCase
    one: OneOrderUseCase
    checkout: CheckoutUseCase
    updateStatus: UpdateOrderStatusUseCase
  }
}

// Order DTOs
export { AllOrdersDto } from '@/modules/checkout/application/dtos/order/all-orders.dto'
export { CheckoutDto } from '@/modules/checkout/application/dtos/order/checkout.dto'
export { OneOrderDto } from '@/modules/checkout/application/dtos/order/one-order.dto'

// Entities
export { OrderItemEntity } from '@/modules/checkout/domain/entities/order-item.entity'
export { OrderEntity } from '@/modules/checkout/domain/entities/order.entity'
