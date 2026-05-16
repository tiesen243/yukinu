import type { Database } from '@yukinu/db/drizzle'

import { eq, min } from '@yukinu/db/drizzle'
import { productImages, products, wishlistItems } from '@yukinu/db/schema'

import type { WishlistItemRepository } from '@/modules/sales/domain/repositories/wishlist-item.repository'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

import { WishlistItemEntity } from '@/modules/sales/domain/entities/wishlist-item.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleWishlistItemRepository
  extends DrizzleRepository<WishlistItemEntity, typeof wishlistItems>
  implements WishlistItemRepository
{
  public constructor(db: Database) {
    super(db, wishlistItems, ['userId', 'productId'])
  }

  public async findWithProduct(
    criterias: AbstractRepository.Criteria<WishlistItemEntity>[] = [],
    orderBy: Partial<Record<keyof WishlistItemEntity, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx: Database = this._db,
  ): Promise<WishlistItemRepository.WithProduct[]> {
    const whereClauses = this._buildCriteria(criterias)
    const orderByClause = this._buildOrderBy(orderBy)

    const query = tx
      .select({
        userId: this._table.userId,
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          image: min(productImages.url),
        },
        addedAt: this._table.addedAt,
      })
      .from(this._table)
      .innerJoin(products, eq(products.id, this._table.productId))
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .groupBy(
        this._table.userId,
        products.id,
        products.name,
        products.price,
        this._table.addedAt,
      )
      .$dynamic()

    if (whereClauses) query.where(whereClauses)
    if (orderByClause) query.orderBy(orderByClause)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)
    console.log(query.toSQL())

    const rows = await query

    return rows.map((row) =>
      Object.assign(
        this._mapToEntity({
          userId: row.userId,
          productId: row.product.id,
          addedAt: row.addedAt,
        }),
        {
          product: {
            id: row.product.id,
            name: row.product.name,
            image: row.product.image,
            price: row.product.price,
          },
        },
      ),
    )
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof wishlistItems>,
  ): WishlistItemEntity {
    return new WishlistItemEntity(row)
  }
}
