import type { Profile } from '@yukinu/db/schema/profile'
import type { User, users } from '@yukinu/db/schema/user'
import type { Database, Transaction } from '@yukinu/db/types'

import type { IBaseRepository } from './base.repository'

export interface IUserRepository extends IBaseRepository<typeof users> {
  findByQueryWithPagination(
    params: IUserRepository.FindByQueryWithPaginationParams,
    tx?: Database | Transaction,
  ): Promise<IUserRepository.FindByQueryWithPaginationResult>

  findByIdentifier(
    params: IUserRepository.FindByIdentifierParams,
    tx?: Database | Transaction,
  ): Promise<IUserRepository.FindByIdentifierResult>

  findByIdWithProfile(
    userId: string,
    tx?: Database | Transaction,
  ): Promise<IUserRepository.FindByIdWithProfileResult>
}

export declare namespace IUserRepository {
  export type UserType = User

  export interface FindByQueryWithPaginationParams {
    search: string
    page: number
    limit: number
  }
  export interface FindByQueryWithPaginationResult {
    users: User[]
    pagination: { page: number; total: number; totalPages: number }
  }

  export interface FindByIdentifierParams {
    username: string
    email: string
  }

  export type FindByIdentifierResult = User | null

  export type FindByIdWithProfileResult = {
    id: User['id']
    username: User['username']
    email: User['email']
    emailVerified: User['emailVerified']
    role: User['role']
    joinedAt: User['createdAt']
    profile: {
      avatarUrl: Profile['avatarUrl']
      fullName: Profile['fullName']
      bio: Profile['bio']
      gender: Profile['gender']
      dateOfBirth: Profile['dateOfBirth']
      website: Profile['website']
    }
  } | null
}
