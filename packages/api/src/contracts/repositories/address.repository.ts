import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { addresses } from '@yukinu/db/schema'

export interface IAddressRepository extends IBaseRepository<typeof addresses> {}
