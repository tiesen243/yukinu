import type { profiles } from '@yukinu/db/schema/profile'

import type { IProfileRepository } from './profile'
import { BaseRepositoryMock } from './base.repository.mock'

export class ProfileRepositoryMock
  extends BaseRepositoryMock<typeof profiles>
  implements IProfileRepository {}
