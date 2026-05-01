import type { Database } from '@yukinu/db/drizzle'

import type { AllProductsDto } from '@/modules/catalog/application/dtos/product/all-products.dto'
import type { ProductRepository } from '@/modules/catalog/domain/repositories/product.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class AllProductsUseCase extends AbstractUseCase<
  AllProductsDto.Input,
  AllProductsDto.Output
> {
  public constructor(
    private readonly _db: Database,
    private readonly _productRepo: ProductRepository,
  ) {
    super()
  }

  public async execute(
    input: AllProductsDto.Input,
  ): Promise<AllProductsDto.Output> {
    const { search, isDeleted, categoryId, vendorId, page, limit } = input
    const offset = (page - 1) * limit

    const whereClauses = [
      {
        name: search ? `%${search}%` : ('not null' as const),
        deletedAt: isDeleted ? ('not null' as const) : ('null' as const),
        ...(categoryId ? { categoryId } : {}),
        ...(vendorId ? { vendorId } : {}),
      },
    ]

    let orderBy = {}
    if (input.orderBy) {
      const [field, direction] = input.orderBy.split('_')
      if (field && direction) orderBy = { [field]: direction as 'asc' | 'desc' }
    }

    const [products, total] = await Promise.all([
      this._productRepo.findWithRelations(whereClauses, orderBy, {
        limit,
        offset,
      }),
      this._productRepo.count(whereClauses),
    ])
    const totalPages = Math.ceil(total / limit)

    return {
      products,
      pagination: { total, page, limit, totalPages },
    }
  }
}
