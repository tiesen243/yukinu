import type { VendorValidators } from '@yukinu/validators/vendor'

import type { IVendorService } from '@/contracts/services/vendor.service'
import { BaseService } from '@/services/base.service'

export class VendorService extends BaseService implements IVendorService {
  all(_input: VendorValidators.AllInput): Promise<VendorValidators.AllOutput> {
    throw new Error('Method not implemented.')
  }

  one(_input: VendorValidators.OneInput): Promise<VendorValidators.OneOutput> {
    throw new Error('Method not implemented.')
  }

  create(
    _input: VendorValidators.CreateInput,
  ): Promise<VendorValidators.CreateOutput> {
    throw new Error('Method not implemented.')
  }

  updateStatus(
    _input: VendorValidators.UpdateStatusInput,
  ): Promise<VendorValidators.UpdateStatusOutput> {
    throw new Error('Method not implemented.')
  }

  update(
    _input: VendorValidators.UpdateInput,
  ): Promise<VendorValidators.UpdateOutput> {
    throw new Error('Method not implemented.')
  }

  addStaff(
    _input: VendorValidators.AddStaffInput,
  ): Promise<VendorValidators.AddStaffOutput> {
    throw new Error('Method not implemented.')
  }

  removeStaff(
    _input: VendorValidators.RemoveStaffInput,
  ): Promise<VendorValidators.RemoveStaffOutput> {
    throw new Error('Method not implemented.')
  }
}
