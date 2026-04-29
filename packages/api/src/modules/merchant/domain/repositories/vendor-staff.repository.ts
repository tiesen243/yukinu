import type { VendorStaffEntity } from '@/modules/merchant/domain/entities/vendor-staff.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface VendorStaffRepository extends AbstractRepository<VendorStaffEntity> {}
