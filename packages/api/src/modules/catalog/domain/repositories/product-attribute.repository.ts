import type { ProductAttributeEntity } from '@/modules/catalog/domain/entities/product-attribute.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface ProductAttributeRepository<
  TTransaction = unknown,
> extends AbstractRepository<ProductAttributeEntity> {
  createAttributes(
    productId: ProductAttributeEntity['id'],
    attrs: { name: string; value: string }[],
    tx?: TTransaction,
  ): Promise<unknown>
}
