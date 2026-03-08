import type { orderItems } from '@yukinu/db/schema'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface IOrderItemRepository extends IBaseRepository<
  typeof orderItems
> {}
