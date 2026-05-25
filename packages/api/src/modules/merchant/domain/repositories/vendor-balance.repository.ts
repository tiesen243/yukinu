import type { VendorBalanceEntity } from '@/modules/merchant/domain/entities/vendor-balance.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface VendorBalanceRepository extends AbstractRepository<VendorBalanceEntity> {}
