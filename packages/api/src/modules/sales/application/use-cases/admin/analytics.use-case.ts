import type { Database } from '@yukinu/db/drizzle'

import { sql, eq, desc } from '@yukinu/db/drizzle'
import { orders, vendors, users } from '@yukinu/db/schema'

import type { AnalyticsDto } from '@/modules/sales/application/dtos/admin/analytics.dto'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class AnalyticsUseCase extends AbstractUseCase<
  AnalyticsDto.Input,
  AnalyticsDto.Output
> {
  constructor(private readonly _db: Database) {
    super()
  }

  async execute(_input: AnalyticsDto.Input): Promise<AnalyticsDto.Output> {
    // 1. Vendor Performance Ranking
    const vendorRanking = await this._db
      .select({
        vendorName: vendors.name,
        revenue: sql<number>`sum(${orders.totalAmount})`.mapWith(Number),
        orderCount: sql<number>`count(${orders.id})`.mapWith(Number),
      })
      .from(vendors)
      .leftJoin(orders, eq(vendors.id, orders.vendorId))
      .groupBy(vendors.id, vendors.name)
      .orderBy(desc(sql`SUM(${orders.totalAmount})`))
      .limit(10)

    // 2. Order Status Distribution (Pie Chart)
    const orderStatusDist = await this._db
      .select({
        status: orders.status,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(orders)
      .groupBy(orders.status)

    // 3. Customer Acquisition Trend (Last 30 days)
    const customerTrend = await this._db
      .select({
        date: sql<string>`to_char(${users.createdAt}, 'YYYY-MM-DD')`,
        newUsers: sql<number>`count(*)`.mapWith(Number),
      })
      .from(users)
      .where(sql`${users.createdAt} > now() - interval '30 days'`)
      .groupBy(sql`to_char(${users.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${users.createdAt}, 'YYYY-MM-DD')`)

    return {
      vendorRanking,
      orderStatusDist,
      customerTrend,
    }
  }
}
