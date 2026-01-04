import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { orders } from '@yukinu/db/schema'

export interface IOrderRepository extends IBaseRepository<typeof orders> {}
