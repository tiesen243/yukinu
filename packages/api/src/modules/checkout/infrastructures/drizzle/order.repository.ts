import type { Database } from '@yukinu/db/drizzle'

import { eq, sql } from '@yukinu/db/drizzle'
import {
  addresses,
  orderItems,
  orders,
  productImages,
  products,
  users,
} from '@yukinu/db/schema'

import type { AllOrdersDto } from '@/modules/checkout/application/dtos/order/all-orders.dto'
import type { OneOrderDto } from '@/modules/checkout/application/dtos/order/one-order.dto'
import type { OrderRepository } from '@/modules/checkout/domain/repositories/order.repository'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

import { OrderEntity } from '@/modules/checkout/domain/entities/order.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleOrderRepository
  extends DrizzleRepository<OrderEntity, typeof orders, number>
  implements OrderRepository
{
  public constructor(db: Database) {
    super(db, orders, 'id')
  }

  public findWithItems(
    criterias: AbstractRepository.Criteria<OrderEntity>[] = [],
    orderBy: Partial<Record<keyof OrderEntity, 'asc' | 'desc'>> = {},
    options: { limit?: number; offset?: number } = {},
    tx: Database = this._db,
  ): Promise<AllOrdersDto.Output['orders']> {
    const whereClauses = this._buildCriteria(criterias)
    const orderByClauses = this._buildOrderBy(orderBy)

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
          AllOrdersDto.Output['orders'][number]['items']
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
      .innerJoin(users, eq(users.id, this._table.userId))
      .leftJoin(orderItems, eq(orderItems.orderId, this._table.id))
      .leftJoin(products, eq(products.id, orderItems.productId))
      .groupBy(this._table.id, users.id)
      .$dynamic()

    if (whereClauses) query.where(whereClauses)
    if (orderByClauses) query.orderBy(orderByClauses)
    if (options.limit) query.limit(options.limit)
    if (options.offset) query.offset(options.offset)

    return query
  }

  public async oneWithDetails(
    criteria: AbstractRepository.Criteria<OrderEntity>,
    tx: Database = this._db,
  ): Promise<OneOrderDto.Output | null> {
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
          OneOrderDto.Output['items']
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
      .innerJoin(users, eq(users.id, this._table.userId))
      .innerJoin(addresses, eq(addresses.id, this._table.addressId))
      .leftJoin(orderItems, eq(orderItems.orderId, this._table.id))
      .leftJoin(products, eq(products.id, orderItems.productId))
      .where(whereClause)
      .groupBy(this._table.id, addresses.id, users.id)
      .limit(1)

    return order ?? null
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof orders>,
  ): OrderEntity {
    return new OrderEntity(row)
  }
}
