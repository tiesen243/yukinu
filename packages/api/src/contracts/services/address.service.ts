import type * as Validators from '@yukinu/validators/user'

export interface IAddressService {
  all(
    input: Validators.AllAddressesInput,
  ): Promise<Validators.AllAddressesOutput>

  one(input: Validators.OneAddressInput): Promise<Validators.OneAddressOutput>

  create(
    input: Validators.CreateAddressInput,
  ): Promise<Validators.CreateAddressOutput>

  update(
    input: Validators.UpdateAddressInput,
  ): Promise<Validators.UpdateAddressOutput>

  delete(
    input: Validators.DeleteAddressInput,
  ): Promise<Validators.DeleteAddressOutput>
}
