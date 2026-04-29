import type { OrderEntity } from '@/modules/checkout/domain/entities/order.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface OrderRepository extends AbstractRepository<
  OrderEntity,
  number
> {}
