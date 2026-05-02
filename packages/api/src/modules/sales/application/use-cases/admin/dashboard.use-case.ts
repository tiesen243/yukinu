import type { Database } from '@yukinu/db/drizzle'

import { sql, eq, and, sum, count } from '@yukinu/db/drizzle'
import {
  orders,
  payments,
  users,
  vendors,
  orderItems,
  products,
} from '@yukinu/db/schema'

import type { DashboardDto } from '@/modules/sales/application/dtos/admin/dashboard.dto'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class DashboardUseCase extends AbstractUseCase<
  DashboardDto.Input,
  DashboardDto.Output
> {
  public constructor(private readonly _db: Database) {
    super()
  }

  async execute(_input: DashboardDto.Input): Promise<DashboardDto.Output> {
    // 1. Overview Metrics
    const [stats] = await this._db
      .select({
        totalRevenue: sum(payments.amount),
        totalOrders: count(orders.id),
        totalUsers: count(users.id),
        activeVendors: sql<number>`count(case when ${vendors.status} = 'approved' then 1 end)`,
      })
      .from(payments)
      .leftJoin(orders, eq(payments.id, orders.paymentId))
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(vendors, eq(orders.vendorId, vendors.id))
      .where(eq(payments.status, 'success'))

    // 2. Revenue Trend (Last 6 months)
    const revenueTrend = await this._db
      .select({
        month: sql<string>`to_char(${payments.createdAt}, 'Mon')`,
        amount: sum(payments.amount).mapWith(Number),
      })
      .from(payments)
      .where(
        and(
          eq(payments.status, 'success'),
          sql`${payments.createdAt} > now() - interval '6 months'`,
        ),
      )
      .groupBy(
        sql`to_char(${payments.createdAt}, 'Mon'), date_trunc('month', ${payments.createdAt})`,
      )
      .orderBy(sql`date_trunc('month', ${payments.createdAt})`)

    // 3. Top Selling Products
    const topProducts = await this._db
      .select({
        name: products.name,
        totalSold: sum(orderItems.quantity).mapWith(Number),
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .groupBy(products.id)
      .orderBy(sql`sum(${orderItems.quantity}) desc`)
      .limit(5)

    // 4. Recent Transactions
    const recentTransactions = await this._db
      .select({
        id: payments.id,
        amount: payments.amount,
        status: payments.status,
        createdAt: payments.createdAt,
      })
      .from(payments)
      .orderBy(sql`${payments.createdAt} desc`)
      .limit(8)

    return {
      metrics: {
        revenue: Number(stats?.totalRevenue ?? 0),
        orders: Number(stats?.totalOrders ?? 0),
        users: Number(stats?.totalUsers ?? 0),
        vendors: Number(stats?.activeVendors ?? 0),
      },
      revenueTrend,
      topProducts,
      recentTransactions,
    }
  }
}
