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
    vendorId: string | null
    productName: string
    productImage: string | null
    productPrice: string
    productStock: number
    variant: Record<string, string>
  }
}
