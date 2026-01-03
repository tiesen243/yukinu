import type * as Validators from '@yukinu/validators/vendor'

export interface IVendorService {
  all(input: Validators.AllVendorsInput): Promise<Validators.AllVendorsOutput>

  one(input: Validators.OneVendorInput): Promise<Validators.OneVendorOutput>

  create(
    input: Validators.CreateVendorInput,
  ): Promise<Validators.CreateVendorOutput>

  updateStatus(
    input: Validators.UpdateVendorStatusInput,
  ): Promise<Validators.UpdateVendorStatusOutput>

  update(
    input: Validators.UpdateVendorInput,
  ): Promise<Validators.UpdateVendorOutput>
}
