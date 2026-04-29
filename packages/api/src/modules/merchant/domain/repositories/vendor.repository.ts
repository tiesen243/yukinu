import type { VendorEntity } from '@/modules/merchant/domain/entities/vendor.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface VendorRepository extends AbstractRepository<VendorEntity> {}
