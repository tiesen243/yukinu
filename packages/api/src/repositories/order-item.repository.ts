import type { IOrderItemRepository } from '@/contracts/repositories/order-item.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'
import type { OneOutput, OrderItemSchema } from '@yukinu/validators/order'

import { BaseRepository } from '@/repositories/base.repository'

export class OrderItemRepository
  extends BaseRepository<typeof Schema.orderItems>
  implements IOrderItemRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.orderItems)
  }

  override async create(
    data: OrderItemSchema,
    tx = this._db,
  ): Promise<OrderItemSchema['id']> {
    const { isNotNull, isNull } = this._orm

    const [result] = await tx
      .insert(this._table)
      .values(data as never)
      .onConflictDoUpdate({
        target: data.productVariantId
          ? [this._table.orderId, this._table.productVariantId]
          : [this._table.orderId, this._table.productId],
        targetWhere: data.productVariantId
          ? isNotNull(this._table.productVariantId)
          : isNull(this._table.productVariantId),
        set: { quantity: data.quantity, unitPrice: data.unitPrice },
      })
      .returning({ id: this._table.id })

    return result ? result.id : ''
  }

  allWithProduct(
    criterias: Partial<OrderItemSchema>[] = [],
    orderBy: Partial<Record<keyof OrderItemSchema, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx = this._db,
  ): Promise<OneOutput['items']> {
    const { and, eq, isNotNull, min, sql } = this._orm
    const {
      products,
      productVariants,
      productImages,
      variantOptions,
      variants,
      vendors,
    } = this._schema

    const whereClause = this._buildCriteria(criterias)
    const orderByClause = this._buildOrderBy(orderBy)

    const variantData = this._db
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

    const query = tx
      .select({
        id: this._table.id,
        vendorId: vendors.id,
        productId: products.id,
        productName: products.name,
        productImage: min(productImages.url),
        productVariantId: productVariants.id,
        unitPrice: this._table.unitPrice,
        quantity: this._table.quantity,
        note: this._table.note,
        stock: products.stock,
        variantStock: productVariants.stock,
        variant: sql<
          Record<string, string>
        >`COALESCE(${variantData.variant}, '{}'::jsonb)`.as('variant'),
      })
      .from(this._table)
      .leftJoin(products, eq(products.id, this._table.productId))
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .leftJoin(
        productVariants,
        eq(productVariants.id, this._table.productVariantId),
      )
      .leftJoinLateral(variantData, sql`TRUE`)
      .leftJoin(vendors, eq(vendors.id, this._table.vendorId))
      .groupBy(
        this._table.id,
        productVariants.id,
        products.id,
        variantData.variant,
        vendors.id,
      )

    if (whereClause) query.where(whereClause)
    if (orderByClause) query.orderBy(orderByClause)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    return query
  }
}
