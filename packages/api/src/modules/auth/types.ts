import type { CreateUserUseCase } from '@/modules/auth/application/use-cases/create-user.use-case'
import type { GetUsersUseCase } from '@/modules/auth/application/use-cases/get-users.use-case'

export interface UseCases {
  getUsers: GetUsersUseCase
  createUser: CreateUserUseCase
}
