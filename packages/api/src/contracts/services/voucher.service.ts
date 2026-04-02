import type * as Validators from '@yukinu/validators/general'

export interface IVoucherService {
  all(input: Validators.AllVouchersInput): Promise<Validators.AllVouchersOutput>

  one(input: Validators.OneVoucherInput): Promise<Validators.OneVoucherOutput>

  create(
    input: Validators.CreateVoucherInput,
  ): Promise<Validators.CreateVoucherOutput>

  update(
    input: Validators.UpdateVoucherInput,
  ): Promise<Validators.UpdateVoucherOutput>

  delete(
    input: Validators.DeleteVoucherInput,
  ): Promise<Validators.DeleteVoucherOutput>
}
