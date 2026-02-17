import type { profiles } from '@yukinu/db/schema'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface IProfileRepository extends IBaseRepository<typeof profiles> {}
