import * as z from 'zod'

import { PaymentEntity } from '@/modules/finance/types'

export namespace DashboardDto {
  export const input = z.object({ vendorId: z.cuid2().optional() })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    metrics: z.object({
      revenue: z.number(),
      orders: z.number(),
      users: z.number(),
      vendors: z.number(),
    }),
    revenueTrend: z.array(
      z.object({
        month: z.string(),
        amount: z.number(),
      }),
    ),
    topProducts: z.array(
      z.object({
        name: z.string(),
        totalSold: z.number(),
      }),
    ),

    recentTransactions: z.array(
      z.object({
        id: z.string(),
        amount: z.string(),
        status: z.enum(PaymentEntity.statuses),
        createdAt: z.date(),
      }),
    ),
  })
  export type Output = z.infer<typeof output>
}
