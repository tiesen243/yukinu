import type { TransactionEntity } from '@/modules/finance/domain/entities/transaction.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface TransactionRepository extends AbstractRepository<TransactionEntity> {}
