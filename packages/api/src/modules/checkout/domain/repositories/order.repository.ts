import type { AllOrdersDto } from '@/modules/checkout/application/dtos/order/all-orders.dto'
import type { OneOrderDto } from '@/modules/checkout/application/dtos/order/one-order.dto'
import type { OrderEntity } from '@/modules/checkout/domain/entities/order.entity'
import type { PaymentEntity } from '@/modules/finance/types'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface OrderRepository<
  TTransaction = unknown,
> extends AbstractRepository<OrderEntity, number> {
  findWithItems(
    criterias?: AbstractRepository.Criteria<OrderEntity>[],
    orderBy?: Partial<Record<keyof OrderEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: TTransaction,
  ): Promise<AllOrdersDto.Output['orders']>

  findWithPayment(
    criterias?: AbstractRepository.Criteria<OrderEntity>[],
    orderBy?: Partial<Record<keyof OrderEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: TTransaction,
  ): Promise<OrderRepository.WithPayment[]>

  oneWithDetails(
    criteria: AbstractRepository.Criteria<OrderEntity>,
    tx?: TTransaction,
  ): Promise<OneOrderDto.Output | null>
}

export namespace OrderRepository {
  export interface WithPayment extends OrderEntity {
    payment: {
      id: string
      status: PaymentEntity.Status
    } | null
  }
}
