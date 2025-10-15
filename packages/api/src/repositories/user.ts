import type { Database, Transaction } from '@yukinu/db'
import type { users } from '@yukinu/db/schema/user'

import type { IBaseRepository } from './base'

export interface IUserRepository extends IBaseRepository<typeof users> {
  findByIdentifier(
    data: IUserRepository.FindByIndentifierParams,
    tx?: Database | Transaction,
  ): Promise<string | null>
}

export declare namespace IUserRepository {
  export interface FindByIndentifierParams {
    username?: string
    email?: string
  }
}
