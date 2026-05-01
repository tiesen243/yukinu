import type { AllOrdersUseCase } from '@/modules/checkout/application/use-cases/order/all-orders.use-case'
import type { CheckoutUseCase } from '@/modules/checkout/application/use-cases/order/checkout.use-case'
import type { OneOrderUseCase } from '@/modules/checkout/application/use-cases/order/one-order.use-case'

export interface UseCases {
	order: {
		all: AllOrdersUseCase
		one: OneOrderUseCase
		checkout: CheckoutUseCase
	}
}

export { AllOrdersDto } from '@/modules/checkout/application/dtos/order/all-orders.dto'
export { CheckoutDto } from '@/modules/checkout/application/dtos/order/checkout.dto'
export { OneOrderDto } from '@/modules/checkout/application/dtos/order/one-order.dto'
