import type { VendorMiddleware } from '@/modules/merchant/interfaces/vendor.middleware'
import type { UseCases } from '@/modules/sales/types'

import { AnalyticsDto } from '@/modules/sales/application/dtos/statistics/analytics.dto'
import { DashboardDto } from '@/modules/sales/application/dtos/statistics/dashboard.dto'
import { protectedProcedure } from '@/trpc'

export const statisticsRouter = (
  { admin }: UseCases,
  deps: {
    vendorMiddleware: VendorMiddleware
  },
) => ({
  analytics: protectedProcedure
    .meta({ role: ['admin', 'moderator'] })
    .input(AnalyticsDto.input)
    .output(AnalyticsDto.output)
    .query(({ input }) => admin.analytics.execute(input)),

  dashboard: protectedProcedure
    .meta({ role: ['admin', 'moderator'] })
    .input(DashboardDto.input.omit({ vendorId: true }))
    .output(DashboardDto.output)
    .query(({ input }) => admin.dashboard.execute(input)),

  vendorDashboard: protectedProcedure
    .use(deps.vendorMiddleware)
    .input(DashboardDto.input.omit({ vendorId: true }))
    .output(DashboardDto.output)
    .query(({ input, ctx }) =>
      admin.dashboard.execute({ ...input, vendorId: ctx.session.vendorId }),
    ),
})
