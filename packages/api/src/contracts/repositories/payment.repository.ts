import type { payments } from '@yukinu/db/schema'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface IPaymentRepository extends IBaseRepository<typeof payments> {}
