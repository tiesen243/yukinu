import type { UseCases } from '@/modules/sales/types'

import { AnalyticsDto } from '@/modules/sales/application/dtos/admin/analytics.dto'
import { DashboardDto } from '@/modules/sales/application/dtos/admin/dashboard.dto'
import { protectedProcedure } from '@/trpc'

export const adminRouter = ({ admin }: UseCases) => ({
  analytics: protectedProcedure
    .meta({ role: ['admin', 'moderator'] })
    .input(AnalyticsDto.input)
    .output(AnalyticsDto.output)
    .query(({ input }) => admin.analytics.execute(input)),

  dashboard: protectedProcedure
    .meta({ role: ['admin', 'moderator'] })
    .input(DashboardDto.input)
    .output(DashboardDto.output)
    .query(({ input }) => admin.dashboard.execute(input)),
})
