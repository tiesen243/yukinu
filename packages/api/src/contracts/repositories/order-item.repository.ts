import type { Database } from '@yukinu/db'
import type { orderItems } from '@yukinu/db/schema'
import type { OneOutput, OrderItemSchema } from '@yukinu/validators/order'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface IOrderItemRepository extends IBaseRepository<
  typeof orderItems
> {
  allWithProduct(
    criterias?: Partial<OrderItemSchema>[],
    orderBy?: Partial<Record<keyof OrderItemSchema, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: Database,
  ): Promise<OneOutput['items']>
}
