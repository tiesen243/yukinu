import * as z from 'zod'

import { OrderEntity } from '@/modules/checkout/domain/entities/order.entity'

export namespace AnalyticsDto {
  export const input = z.void()
  export type Input = z.infer<typeof input>

  export const output = z.object({
    vendorRanking: z.array(
      z.object({
        vendorName: z.string(),
        revenue: z.number().nullable(),
        orderCount: z.number(),
      }),
    ),
    orderStatusDist: z.array(
      z.object({
        status: z.enum(OrderEntity.statuses),
        count: z.number(),
      }),
    ),
    customerTrend: z.array(
      z.object({
        date: z.string(),
        newUsers: z.number(),
      }),
    ),
  })
  export type Output = z.infer<typeof output>
}
