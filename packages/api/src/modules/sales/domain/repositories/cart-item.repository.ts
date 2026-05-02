import type { CartItemEntity } from '@/modules/sales/domain/entities/cart-item.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface CartItemRepository<
  TTransaction = unknown,
> extends AbstractRepository<CartItemEntity> {
  findWithProduct(
    criterias?: AbstractRepository.Criteria<CartItemEntity>[],
    orderBy?: Partial<Record<keyof CartItemEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: TTransaction,
  ): Promise<CartItemRepository.WithProduct[]>
}

export namespace CartItemRepository {
  export interface WithProduct extends CartItemEntity {
    product: {
      vendorId: string | null
      name: string
      image: string | null
      price: string
      stock: number
      variant: Record<string, string>
    }
  }
}
