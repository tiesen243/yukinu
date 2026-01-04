import type * as Validators from '@yukinu/validators/product'

export interface IProductService {
  all(input: Validators.AllInput): Promise<Validators.AllOutput>

  one(input: Validators.OneInput): Promise<Validators.OneOutput>

  create(input: Validators.CreateInput): Promise<Validators.CreateOutput>

  update(input: Validators.UpdateInput): Promise<Validators.UpdateOutput>

  delete(input: Validators.DeleteInput): Promise<Validators.DeleteOutput>

  restore(input: Validators.RestoreInput): Promise<Validators.RestoreOutput>

  permanentlyDelete(
    input: Validators.PermanentlyDeleteInput,
  ): Promise<Validators.PermanentlyDeleteOutput>
}
