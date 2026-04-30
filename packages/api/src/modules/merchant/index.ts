import type { TRPCRouterRecord } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'

import { AllVendorsUseCase } from '@/modules/merchant/application/use-cases/vendor/all-vendors.use-case'
import { OneVendorUseCase } from '@/modules/merchant/application/use-cases/vendor/one-vendor.use-case'
import { SaveVendorUseCase } from '@/modules/merchant/application/use-cases/vendor/save-vendor.use-case'
import { UpdateVendorStatusUseCase } from '@/modules/merchant/application/use-cases/vendor/update-vendor-status.use-case'
import { DrizzleVendorRepository } from '@/modules/merchant/infrastructures/drizzle/vendor.repository'
import { vendorRouter } from '@/modules/merchant/interfaces/vendor.router'

export const createMerchantModule = (
  db: Database,
  deps: { userRepo: UserRepository },
) => {
  const vendorRepo = new DrizzleVendorRepository(db)

  const useCases = {
    vendor: {
      all: new AllVendorsUseCase(db, vendorRepo),
      one: new OneVendorUseCase(db, vendorRepo),
      save: new SaveVendorUseCase(db, vendorRepo),
      updateStatus: new UpdateVendorStatusUseCase(
        db,
        vendorRepo,
        deps.userRepo,
      ),
    },
  }

  return {
    useCases,
    router: {
      vendor: vendorRouter(useCases),
    } satisfies TRPCRouterRecord,
  }
}
