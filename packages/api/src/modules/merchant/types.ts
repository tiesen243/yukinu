import type { AllVendorsUseCase } from '@/modules/merchant/application/use-cases/vendor/all-vendors.use-case'
import type { OneVendorUseCase } from '@/modules/merchant/application/use-cases/vendor/one-vendor.use-case'
import type { SaveVendorUseCase } from '@/modules/merchant/application/use-cases/vendor/save-vendor.use-case'
import type { UpdateVendorStatusUseCase } from '@/modules/merchant/application/use-cases/vendor/update-vendor-status.use-case'
import type { AllStaffsUseCase } from '@/modules/merchant/application/use-cases/staff/all-staffs.use-case'
import type { InviteStaffUseCase } from '@/modules/merchant/application/use-cases/staff/invite-staff.use-case'
import type { AcceptInvitationUseCase } from '@/modules/merchant/application/use-cases/staff/accept-invitation.use-case'
import type { RemoveStaffUseCase } from '@/modules/merchant/application/use-cases/staff/remove-staff.use-case'

export interface UseCases {
  vendor: {
    all: AllVendorsUseCase
    one: OneVendorUseCase
    save: SaveVendorUseCase
    updateStatus: UpdateVendorStatusUseCase
  }
  staff: {
    all: AllStaffsUseCase
    invite: InviteStaffUseCase
    accept: AcceptInvitationUseCase
    remove: RemoveStaffUseCase
  }
}

// Vendor DTOs
export { AllVendorsDto } from '@/modules/merchant/application/dtos/vendor/all-vendors.dto'
export { OneVendorDto } from '@/modules/merchant/application/dtos/vendor/one-vendor.dto'
export { SaveVendorDto } from '@/modules/merchant/application/dtos/vendor/save-vendor.dto'
export { UpdateVendorStatusDto } from '@/modules/merchant/application/dtos/vendor/update-vendor-status.dto'

// Staff DTOs
export { AllStaffsDto } from '@/modules/merchant/application/dtos/staff/all-staffs.dto'
export { InviteStaffDto } from '@/modules/merchant/application/dtos/staff/invite-staff.dto'
export { AcceptInvitationDto } from '@/modules/merchant/application/dtos/staff/accept-invitation.dto'
export { RemoveStaffDto } from '@/modules/merchant/application/dtos/staff/remove-staff.dto'
