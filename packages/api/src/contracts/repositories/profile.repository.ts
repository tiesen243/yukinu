import type { profiles } from '@yukinu/db/schema/profile'

import type { IBaseRepository } from './base.repository'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IProfileRepository extends IBaseRepository<typeof profiles> {}
