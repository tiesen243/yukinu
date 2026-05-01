import type { WishlistItemEntity } from '@/modules/sales/domain/entities/wishlist-item.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface WishlistItemRepository<
  TTransaction = unknown,
> extends AbstractRepository<WishlistItemEntity> {
  findWithProduct(
    criterias?: AbstractRepository.Criteria<WishlistItemEntity>[],
    orderBy?: Partial<Record<keyof WishlistItemEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: TTransaction,
  ): Promise<WishlistItemRepository.WithProduct[]>
}

export namespace WishlistItemRepository {
  export interface WithProduct extends WishlistItemEntity {
    product: {
      id: string
      name: string
      image: string | null
      price: string
    }
  }
}
