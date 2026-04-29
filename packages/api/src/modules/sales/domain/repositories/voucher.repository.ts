import type { VoucherItemEntity } from '@/modules/sales/domain/entities/voucher.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface VoucherRepository extends AbstractRepository<VoucherItemEntity> {}
