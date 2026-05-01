import type { VariantEntity } from '@/modules/catalog/domain/entities/variant.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

import type { ProductEntity } from '@/modules/catalog/domain/entities/product.entity'

export interface VariantRepository<
  TTransaction = unknown,
> extends AbstractRepository<VariantEntity> {
  createWithOptions(
    productId: ProductEntity['id'],
    vrts: { name: string; options: string[] }[],
    tx?: TTransaction,
  ): Promise<void>
}
