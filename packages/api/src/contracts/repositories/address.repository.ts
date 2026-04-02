import type { addresses } from '@yukinu/db/schema'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface IAddressRepository extends IBaseRepository<typeof addresses> {}
