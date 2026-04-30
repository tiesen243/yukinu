import type { VendorEntity } from '@/modules/merchant/domain/entities/vendor.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface VendorRepository<
  TTransaction = unknown,
> extends AbstractRepository<VendorEntity> {
  findWithOwner(
    criterias?: AbstractRepository.Criteria<VendorEntity>[],
    orderBy?: Partial<Record<keyof VendorEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: TTransaction,
  ): Promise<(VendorEntity & { owner: { id: string; username: string } })[]>
}
