import type { ProfileEntity } from '@/modules/identity/domain/entities/profile.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface ProfileRepository extends AbstractRepository<ProfileEntity> {}
