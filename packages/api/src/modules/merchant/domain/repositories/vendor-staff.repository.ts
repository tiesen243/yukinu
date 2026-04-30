import type { VendorStaffEntity } from '@/modules/merchant/domain/entities/vendor-staff.entity'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

export interface VendorStaffRepository<
  TTransaction = unknown,
> extends AbstractRepository<VendorStaffEntity> {
  findWithUser(
    criterias?: AbstractRepository.Criteria<VendorStaffEntity>[],
    orderBy?: Partial<Record<keyof VendorStaffEntity, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: TTransaction,
  ): Promise<
    (VendorStaffEntity & {
      user: { id: string; username: string; email: string }
    })[]
  >
}
