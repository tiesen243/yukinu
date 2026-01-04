import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { accounts } from '@yukinu/db/schema'

export interface IAccountRepository extends IBaseRepository<typeof accounts> {}
