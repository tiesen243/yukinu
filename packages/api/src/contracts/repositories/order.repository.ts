import type { orders } from '@yukinu/db/schema'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface IOrderRepository extends IBaseRepository<typeof orders> {}
