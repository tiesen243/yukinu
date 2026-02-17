import type { accounts } from '@yukinu/db/schema'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface IAccountRepository extends IBaseRepository<typeof accounts> {}
