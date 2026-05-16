import type { Database } from '@yukinu/db/drizzle'

import { and, eq, isNotNull, isNull, min, sql } from '@yukinu/db/drizzle'
import {
  cartItems,
  productImages,
  products,
  productVariants,
  variantOptions,
  variants,
} from '@yukinu/db/schema'

import type { CartItemRepository } from '@/modules/sales/domain/repositories/cart-item.repository'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

import { CartItemEntity } from '@/modules/sales/domain/entities/cart-item.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleCartItemRepository
  extends DrizzleRepository<CartItemEntity, typeof cartItems>
  implements CartItemRepository
{
  public constructor(db: Database) {
    super(db, cartItems, ['userId', 'productId'])
  }

  public override async save(
    entity: CartItemEntity,
    tx: Database = this._db,
  ): Promise<string> {
    const row = this._mapToRow(entity)

    const [pkey] = await tx
      .insert(this._table)
      .values(row)
      .onConflictDoUpdate({
        target: row.productVariantId
          ? [this._table.userId, this._table.productVariantId]
          : [this._table.userId, this._table.productId],
        targetWhere: row.productVariantId
          ? isNotNull(this._table.productVariantId)
          : isNull(this._table.productVariantId),
        set: { quantity: row.quantity },
      })
      .returning({ id: this._table.id })
    if (!pkey) throw new Error('Failed to save cart item')
    return pkey.id
  }

  public async findWithProduct(
    criterias: AbstractRepository.Criteria<CartItemEntity>[] = [],
    orderBy: Partial<Record<keyof CartItemEntity, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx: Database = this._db,
  ): Promise<CartItemRepository.WithProduct[]> {
    const whereClauses = this._buildCriteria(criterias)
    const orderByClauses = this._buildOrderBy(orderBy)

    const variantData = tx
      .select({
        variant: sql<
          Record<string, string>
        >`jsonb_object_agg(${variants.name}, ${variantOptions.value})`.as(
          'variant',
        ),
      })
      .from(variantOptions)
      .leftJoin(variants, eq(variants.id, variantOptions.variantId))
      .where(
        and(
          isNotNull(productVariants.sku),
          sql`${variantOptions.id} = ANY((string_to_array(${productVariants.sku}, '-'))[2:]::int[])`,
        ),
      )
      .as('variant_data')

    const query = this._db
      .select({
        id: this._table.id,
        userId: this._table.userId,
        productId: this._table.productId,
        productVariantId: this._table.productVariantId,
        quantity: this._table.quantity,
        productName: products.name,
        productImage: min(productImages.url),
        productPrice: products.price,
        productStock: sql<number>`LEAST(${productVariants.stock}, ${products.stock})`,
        variant: sql<
          Record<string, string>
        >`COALESCE(${variantData.variant}, '{}'::jsonb)`.as('variant'),
        vendorId: products.vendorId,
      })
      .from(this._table)
      .innerJoin(products, eq(products.id, this._table.productId))
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .leftJoin(
        productVariants,
        eq(productVariants.id, this._table.productVariantId),
      )
      .leftJoinLateral(variantData, sql`true`)
      .groupBy(
        this._table.id,
        productVariants.id,
        products.id,
        variantData.variant,
      )

    if (whereClauses) query.where(whereClauses)
    if (orderByClauses) query.orderBy(orderByClauses)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    const rows = await query
    return rows.map((row) =>
      Object.assign(
        this._mapToEntity({
          id: row.id,
          userId: row.userId,
          productId: row.productId,
          productVariantId: row.productVariantId,
          quantity: row.quantity,
        }),
        {
          product: {
            vendorId: row.vendorId,
            name: row.productName,
            image: row.productImage,
            price: row.productPrice,
            stock: row.productStock,

            variant: row.variant,
          },
        },
      ),
    )
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof cartItems>,
  ): CartItemEntity {
    return new CartItemEntity(row)
  }
}
