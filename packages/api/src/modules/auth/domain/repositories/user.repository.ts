import type { UserEntity } from '@/modules/auth/domain/entities/user.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface IUserRepository extends AbstractRepository<UserEntity> {}
