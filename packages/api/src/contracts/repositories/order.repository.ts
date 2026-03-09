import type { Database } from '@yukinu/db'
import type { orders } from '@yukinu/db/schema'
import type { AllOutput } from '@yukinu/validators/order'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface IOrderRepository extends IBaseRepository<typeof orders> {
  allWithItems(
    criterias?: Partial<(typeof orders)['$inferSelect']>[],
    orderBy?: Partial<
      Record<keyof (typeof orders)['$inferSelect'], 'asc' | 'desc'>
    >,
    options?: { limit?: number; offset?: number },
    tx?: Database,
  ): Promise<AllOutput['orders']>
}
