import type { VerificationEntity } from '@/modules/identity/domain/entities/verification.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface VerificationRepository<
  TTransaction = unknown,
> extends AbstractRepository<VerificationEntity> {
  findWithUser(
    criterias?: AbstractRepository.Criteria<VerificationEntity>[],
    orderBy?: Partial<Record<keyof VerificationEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: TTransaction,
  ): Promise<VerificationEntity.WithUser[]>
}
