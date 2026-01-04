import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { tickets } from '@yukinu/db/schema'

export interface ITicketRepository extends IBaseRepository<typeof tickets> {}
