import type { VendorValidators } from '@yukinu/validators/vendor'

export interface IVendorService {
  all(input: VendorValidators.AllInput): Promise<VendorValidators.AllOutput>

  one(input: VendorValidators.OneInput): Promise<VendorValidators.OneOutput>

  create(
    input: VendorValidators.CreateInput,
  ): Promise<VendorValidators.CreateOutput>

  updateStatus(
    input: VendorValidators.UpdateStatusInput,
  ): Promise<VendorValidators.UpdateStatusOutput>

  update(
    input: VendorValidators.UpdateInput,
  ): Promise<VendorValidators.UpdateOutput>

  allStaffs(
    input: VendorValidators.AllStaffsInput,
  ): Promise<VendorValidators.AllStaffsOutput>

  addStaff(
    input: VendorValidators.AddStaffInput,
  ): Promise<VendorValidators.AddStaffOutput>

  removeStaff(
    input: VendorValidators.RemoveStaffInput,
  ): Promise<VendorValidators.RemoveStaffOutput>
}
