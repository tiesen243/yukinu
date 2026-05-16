import type { OrderItemEntity } from '@/modules/checkout/domain/entities/order-item.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface OrderItemRepository extends AbstractRepository<OrderItemEntity> {}
