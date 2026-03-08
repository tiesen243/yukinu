import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'
import type { CartItemSchema } from '@yukinu/validators/cart'

import type { ICartItemRepository } from '@/contracts/repositories/cart-item.repository'

import { BaseRepository } from '@/repositories/base.repository'

export class CartItemRepository
  extends BaseRepository<typeof Schema.cartItems>
  implements ICartItemRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.cartItems)
  }

  allWithProduct(
    criterias: Partial<CartItemSchema>[] = [],
    orderBy: Partial<Record<keyof CartItemSchema, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx = this._db,
  ): Promise<ICartItemRepository.CartItemWithProduct[]> {
    const { and, eq, isNotNull, min, sql } = this._orm
    const {
      products,
      productVariants,
      productImages,
      variantOptions,
      variants,
    } = this._schema

    const whereClause = this._buildCriteria(criterias)
    const orderByClause = this._buildOrderBy(orderBy)

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

    if (whereClause) query.where(whereClause)
    if (orderByClause) query.orderBy(orderByClause)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    return query.execute()
  }

  override async create(
    data: (typeof Schema.cartItems)['$inferInsert'],
    tx = this._db,
  ): Promise<string> {
    const { isNull, isNotNull } = this._orm

    const [result] = await tx
      .insert(this._table)
      .values(data as never)
      .returning({ id: this._table.id })
      .onConflictDoUpdate({
        target: data.productVariantId
          ? [this._table.userId, this._table.productVariantId]
          : [this._table.userId, this._table.productId],
        targetWhere: data.productVariantId
          ? isNotNull(this._table.productVariantId)
          : isNull(this._table.productVariantId),
        set: { quantity: data.quantity },
      })

    return result ? result.id : ''
  }
}
