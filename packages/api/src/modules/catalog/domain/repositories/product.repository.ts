import type { AllProductsDto } from '@/modules/catalog/application/dtos/product/all-products.dto'
import type { OneProductDto } from '@/modules/catalog/application/dtos/product/one-product.dto'
import type { ProductEntity } from '@/modules/catalog/domain/entities/product.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface ProductRepository<
  TTransaction = unknown,
> extends AbstractRepository<ProductEntity> {
  findWithRelations(
    criterias?: AbstractRepository.Criteria<ProductEntity>[],
    orderBy?: Partial<Record<keyof ProductEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: TTransaction,
  ): Promise<AllProductsDto.Output['products']>

  findWithDetails(
    id: ProductEntity['id'],
    tx?: TTransaction,
  ): Promise<Omit<OneProductDto.Output, 'isWishlisted'> | null>
}
