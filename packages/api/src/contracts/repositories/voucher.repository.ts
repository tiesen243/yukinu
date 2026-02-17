import type { vouchers } from '@yukinu/db/schema'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface IVoucherRepository extends IBaseRepository<typeof vouchers> {}
