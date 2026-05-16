import type { AccountEntity } from '@/modules/identity/domain/entities/account.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface AccountRepository extends AbstractRepository<AccountEntity> {}
