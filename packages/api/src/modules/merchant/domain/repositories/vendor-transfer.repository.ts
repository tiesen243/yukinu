import type { VendorTransferEntity } from '@/modules/merchant/domain/entities/vendor-transfer.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface VendorTransferRepository extends AbstractRepository<VendorTransferEntity> {}
