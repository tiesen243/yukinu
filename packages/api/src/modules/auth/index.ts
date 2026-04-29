import type { Database } from '@yukinu/db/drizzle'

import { users } from '@yukinu/db/schema'

import type { UseCases } from '@/modules/auth/types'

import { CreateUserUseCase } from '@/modules/auth/application/use-cases/create-user.use-case'
import { GetUsersUseCase } from '@/modules/auth/application/use-cases/get-users.use-case'
import { UserRepository } from '@/modules/auth/infrastructures/drizzle/user.repository'
import { authRouter } from '@/modules/auth/interfaces/auth.router'

export const createAuthModule = (db: Database) => {
  const userRepo = new UserRepository(db, users, 'id')

  const useCases = {
    getUsers: new GetUsersUseCase(userRepo),
    createUser: new CreateUserUseCase(userRepo),
  } satisfies UseCases

  return {
    router: authRouter(useCases),
  }
}
