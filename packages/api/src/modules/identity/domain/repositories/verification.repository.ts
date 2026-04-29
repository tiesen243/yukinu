import type { VerificationEntity } from '@/modules/identity/domain/entities/verification.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface VerificationRepository extends AbstractRepository<VerificationEntity> {}
