import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import type { Database } from '@yukinu/db/drizzle'

import { createCatalogModule } from '@/modules/catalog'
import { createCheckoutModule } from '@/modules/checkout'
import { createFinanceModule } from '@/modules/finance'
import { createIdentityModule } from '@/modules/identity'
import { createMerchantModule } from '@/modules/merchant'
import { createSalesModule } from '@/modules/sales'
import { createTRPCRouter } from '@/trpc'

const createApp = (db: Database) => {
  const catalogModule = createCatalogModule(db)
  const checkoutModule = createCheckoutModule(db)
  const financeModule = createFinanceModule(db)
  const identityModule = createIdentityModule(db)
  const merchantModule = createMerchantModule(db)
  const salesModule = createSalesModule(db)

  return createTRPCRouter({
    catalog: catalogModule.router,
    checkout: checkoutModule.router,
    finance: financeModule.router,
    identity: identityModule.router,
    merchant: merchantModule.router,
    sales: salesModule.router,
  })
}

type AppRouter = ReturnType<typeof createApp>
type RouterInputs = inferRouterInputs<AppRouter>
type RouterOutputs = inferRouterOutputs<AppRouter>

export type { AppRouter, RouterInputs, RouterOutputs }
export { createApp }
