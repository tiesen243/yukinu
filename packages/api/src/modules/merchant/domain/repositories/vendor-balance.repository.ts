import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

import type { VendorBalanceEntity } from '@/modules/merchant/domain/entities/vendor-balance.entity'

export interface VendorBalanceRepository extends AbstractRepository<VendorBalanceEntity> {}
