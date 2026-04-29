import type { WishlistItemEntity } from '@/modules/sales/domain/entities/wishlist-item.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface WishlistItemRepository extends AbstractRepository<WishlistItemEntity> {}
