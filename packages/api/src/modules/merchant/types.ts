import type { AllVendorsUseCase } from '@/modules/merchant/application/use-cases/vendor/all-vendors.use-case'
import type { OneVendorUseCase } from '@/modules/merchant/application/use-cases/vendor/one-vendor.use-case'
import type { SaveVendorUseCase } from '@/modules/merchant/application/use-cases/vendor/save-vendor.use-case'
import type { UpdateVendorStatusUseCase } from '@/modules/merchant/application/use-cases/vendor/update-vendor-status.use-case'

export interface UseCases {
  vendor: {
    all: AllVendorsUseCase
    one: OneVendorUseCase
    save: SaveVendorUseCase
    updateStatus: UpdateVendorStatusUseCase
  }
}

// Vendor DTOs
export { AllVendorsDto } from '@/modules/merchant/application/dtos/vendor/all-vendors.dto'
export { OneVendorDto } from '@/modules/merchant/application/dtos/vendor/one-vendor.dto'
export { SaveVendorDto } from '@/modules/merchant/application/dtos/vendor/save-vendor.dto'
export { UpdateVendorStatusDto } from '@/modules/merchant/application/dtos/vendor/update-vendor-status.dto'
