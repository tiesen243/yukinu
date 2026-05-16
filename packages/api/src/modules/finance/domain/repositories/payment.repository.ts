import type { PaymentEntity } from '@/modules/finance/domain/entities/payment.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface PaymentRepository extends AbstractRepository<PaymentEntity> {}
