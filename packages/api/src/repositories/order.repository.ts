import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'
import type { AllOutput, OneOutput } from '@yukinu/validators/order'

import type { IOrderRepository } from '@/contracts/repositories/order.repository'

import { BaseRepository } from '@/repositories/base.repository'

export class OrderRepository
  extends BaseRepository<typeof Schema.orders>
  implements IOrderRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.orders)
  }

  allWithItems(
    criterias: Partial<(typeof Schema.orders)['$inferSelect']>[] = [],
    orderBy: Partial<
      Record<keyof (typeof Schema.orders)['$inferSelect'], 'asc' | 'desc'>
    > = {},
    options: { limit?: number; offset?: number } = {},
    tx = this._db,
  ): Promise<AllOutput['orders']> {
    const { users, orderItems, productImages, products } = this._schema
    const { eq, sql } = this._orm

    const whereClause = this._buildCriteria(criterias)
    const orderByClause = this._buildOrderBy(orderBy)

    const query = tx
      .select({
        id: this._table.id,
        status: this._table.status,
        totalAmount: this._table.totalAmount,
        user: {
          id: users.id,
          username: users.username,
        },
        items: sql<
          AllOutput['orders'][number]['items']
        >`jsonb_path_query_array(jsonb_agg(jsonb_build_object(
            'quantity', ${orderItems.quantity},
            'productId', ${orderItems.productId},
            'unitPrice', ${orderItems.unitPrice}::text,
            'productName', ${products.name},
            'productImage', (
              SELECT ${productImages.url} 
              FROM ${productImages} 
              WHERE ${productImages.productId} = ${products.id} 
              LIMIT 1
            )
          )), '$[0 to 2]')`,
      })
      .from(this._table)
      .leftJoin(users, eq(users.id, this._table.userId))
      .leftJoin(orderItems, eq(orderItems.orderId, this._table.id))
      .leftJoin(products, eq(products.id, orderItems.productId))
      .groupBy(this._table.id, users.id)
      .$dynamic()

    if (whereClause) query.where(whereClause)
    if (orderByClause) query.orderBy(orderByClause)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    return query
  }

  async oneWithDetails(
    criteria: Partial<(typeof Schema.orders)['$inferSelect']>,
    tx = this._db,
  ): Promise<OneOutput | null> {
    const { addresses, users, orderItems, productImages, products } =
      this._schema
    const { eq, sql } = this._orm

    const whereClause = this._buildCriteria([criteria])

    const [order] = await tx
      .select({
        id: this._table.id,
        status: this._table.status,
        totalAmount: this._table.totalAmount,
        createdAt: this._table.createdAt,
        updatedAt: this._table.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          username: users.username,
        },
        address: {
          id: addresses.id,
          recipientName: addresses.recipientName,
          phoneNumber: addresses.phoneNumber,
          street: addresses.street,
          city: addresses.city,
          state: addresses.state,
          postalCode: addresses.postalCode,
          country: addresses.country,
        },
        items: sql<
          OneOutput['items']
        >`jsonb_path_query_array(jsonb_agg(jsonb_build_object(
            'quantity', ${orderItems.quantity},
            'productId', ${orderItems.productId},
            'unitPrice', ${orderItems.unitPrice}::text,
            'productName', ${products.name},
            'productImage', (
              SELECT ${productImages.url} 
              FROM ${productImages} 
              WHERE ${productImages.productId} = ${products.id} 
              LIMIT 1
            )
          )), '$[0 to 2]')`,
      })
      .from(this._table)
      .where(whereClause)
      .leftJoin(users, eq(users.id, this._table.userId))
      .leftJoin(addresses, eq(addresses.id, this._table.addressId))
      .leftJoin(orderItems, eq(orderItems.orderId, this._table.id))
      .leftJoin(products, eq(products.id, orderItems.productId))
      .groupBy(this._table.id, addresses.id, users.id)

    return order ?? null
  }
}
