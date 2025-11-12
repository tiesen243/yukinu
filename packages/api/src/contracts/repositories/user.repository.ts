import type { NewUser, User, users } from '@yukinu/db/schema/user'

import type { IBaseRepository } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUserRepository extends IBaseRepository<typeof users> {}

export namespace IUserRepository {
  export type IUser = User
  export type INewUser = NewUser
}
