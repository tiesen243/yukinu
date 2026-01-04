import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { profiles } from '@yukinu/db/schema'

export interface IProfileRepository extends IBaseRepository<typeof profiles> {}
