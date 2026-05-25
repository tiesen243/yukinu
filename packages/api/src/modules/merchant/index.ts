import type { TRPCRouterRecord } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { UserRepository } from '@/modules/identity/domain/repositories/user.repository'
import type { VerificationRepository } from '@/modules/identity/domain/repositories/verification.repository'
import type { UseCases } from '@/modules/merchant/types'

import { AcceptInvitationUseCase } from '@/modules/merchant/application/use-cases/staff/accept-invitation.use-case'
import { AllStaffsUseCase } from '@/modules/merchant/application/use-cases/staff/all-staffs.use-case'
import { InviteStaffUseCase } from '@/modules/merchant/application/use-cases/staff/invite-staff.use-case'
import { RemoveStaffUseCase } from '@/modules/merchant/application/use-cases/staff/remove-staff.use-case'
import { AllVendorsUseCase } from '@/modules/merchant/application/use-cases/vendor/all-vendors.use-case'
import { GetBalanceUseCase } from '@/modules/merchant/application/use-cases/vendor/get-balance.use-case'
import { OneVendorUseCase } from '@/modules/merchant/application/use-cases/vendor/one-vendor.use-case'
import { SaveVendorUseCase } from '@/modules/merchant/application/use-cases/vendor/save-vendor.use-case'
import { UpdateVendorStatusUseCase } from '@/modules/merchant/application/use-cases/vendor/update-vendor-status.use-case'
import { DrizzleVendorBalanceRepository } from '@/modules/merchant/infrastructures/drizzle/vendor-balance.repository'
import { DrizzleVendorStaffRepository } from '@/modules/merchant/infrastructures/drizzle/vendor-staff.repository'
import { DrizzleVendorTransferRepository } from '@/modules/merchant/infrastructures/drizzle/vendor-transfer.repository'
import { DrizzleVendorRepository } from '@/modules/merchant/infrastructures/drizzle/vendor.repository'
import { staffRouter } from '@/modules/merchant/interfaces/staff.router'
import { vendorMiddleware } from '@/modules/merchant/interfaces/vendor.middleware'
import { vendorRouter } from '@/modules/merchant/interfaces/vendor.router'

export const createMerchantModule = (
  db: Database,
  deps: { userRepo: UserRepository; verificationRepo: VerificationRepository },
) => {
  const vendorRepo = new DrizzleVendorRepository(db)
  const vendorStaffRepo = new DrizzleVendorStaffRepository(db)
  const vendorBalanceRepo = new DrizzleVendorBalanceRepository(db)
  const vendorTransferRepo = new DrizzleVendorTransferRepository(db)

  const useCases = {
    vendor: {
      all: new AllVendorsUseCase(db, vendorRepo),
      one: new OneVendorUseCase(db, vendorRepo),
      getBalance: new GetBalanceUseCase(
        db,
        vendorBalanceRepo,
        vendorTransferRepo,
      ),
      save: new SaveVendorUseCase(db, vendorRepo),
      updateStatus: new UpdateVendorStatusUseCase(
        db,
        vendorRepo,
        deps.userRepo,
      ),
    },
    staff: {
      all: new AllStaffsUseCase(vendorStaffRepo),
      invite: new InviteStaffUseCase(
        db,
        deps.userRepo,
        vendorRepo,
        vendorStaffRepo,
        deps.verificationRepo,
      ),
      accept: new AcceptInvitationUseCase(
        db,
        deps.verificationRepo,
        vendorRepo,
        vendorStaffRepo,
        deps.userRepo,
      ),
      remove: new RemoveStaffUseCase(db, deps.userRepo, vendorStaffRepo),
    },
  } satisfies UseCases

  return {
    useCases,

    router: {
      staff: staffRouter(useCases),
      vendor: vendorRouter(useCases),
    } satisfies TRPCRouterRecord,

    repos: {
      vendorBalanceRepo,
      vendorTransferRepo,
    },

    middlewares: {
      vendor: vendorMiddleware,
    },
  }
}
