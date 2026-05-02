import type { VendorEntity } from '@/modules/merchant/domain/entities/vendor.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface VendorRepository<
  TTransaction = unknown,
> extends AbstractRepository<VendorEntity> {
  findWithDetails(
    criterias?: AbstractRepository.Criteria<VendorEntity>[],
    orderBy?: Partial<Record<keyof VendorEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: TTransaction,
  ): Promise<VendorRepository.WithDetails[]>
}

export namespace VendorRepository {
  export interface WithDetails extends VendorEntity {
    owner: {
      id: string
      username: string
    }
    staffCount: number
  }
}
