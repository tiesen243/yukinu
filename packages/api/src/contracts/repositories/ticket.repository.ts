import type { tickets } from '@yukinu/db/schema'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface ITicketRepository extends IBaseRepository<typeof tickets> {}
