import type { UserValidator } from '@yukinu/validators/user'

import type { IUserRepository } from '../repositories/user.repository'

export interface IUserService {
  getUsers(
    query: UserValidator.FindByQueryWithPaginationQuery,
  ): Promise<IUserRepository.FindByQueryWithPaginationResult>

  getUserProfile(user: {
    id: IUserRepository.UserType['id']
  }): Promise<IUserRepository.FindByIdWithProfileResult>

  updateUser(
    data: UserValidator.UpdateUserBody,
    actingUser: UserValidator.User,
  ): Promise<{ id: IUserRepository.UserType['id'] }>

  updateUserProfile(
    userId: IUserRepository.UserType['id'],
    data: UserValidator.UpdateProfileBody,
  ): Promise<{ id: IUserRepository.UserType['id'] }>
}
