import type { CartItemEntity } from '@/modules/sales/domain/entities/cart-item.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface CartItemRepository extends AbstractRepository<CartItemEntity> {}
