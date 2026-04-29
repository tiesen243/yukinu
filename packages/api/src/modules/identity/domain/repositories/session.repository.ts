import type { SessionEntity } from '@/modules/identity/domain/entities/session.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface SessionRepository extends AbstractRepository<SessionEntity> {}
