import type { UserEntity } from '@/modules/identity/domain/entities/user.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface UserRepository extends AbstractRepository<UserEntity> {}
