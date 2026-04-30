import type { AllStaffsDto } from '@/modules/merchant/application/dtos/staff/all-staffs.dto'
import type { VendorStaffRepository } from '@/modules/merchant/domain/repositories/vendor-staff.repository'

import { AbstractUseCase } from '@/shared/abstracts/abstract.use-case'

export class AllStaffsUseCase extends AbstractUseCase<
  AllStaffsDto.Input,
  AllStaffsDto.Output
> {
  public constructor(private readonly vendorStaffRepo: VendorStaffRepository) {
    super()
  }

  public execute(input: AllStaffsDto.Input): Promise<AllStaffsDto.Output> {
    return this.vendorStaffRepo.find([{ vendorId: input.id }])
  }
}
