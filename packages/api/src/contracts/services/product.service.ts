import type { ProductValidators } from '@yukinu/validators/product'

export interface IProductService {
  all(input: ProductValidators.AllInput): Promise<ProductValidators.AllOutput>

  one(input: ProductValidators.OneInput): Promise<ProductValidators.OneOutput>

  create(
    input: ProductValidators.CreateInput,
  ): Promise<ProductValidators.CreateOutput>

  update(
    input: ProductValidators.UpdateInput,
  ): Promise<ProductValidators.UpdateOutput>

  delete(
    input: ProductValidators.DeleteInput,
  ): Promise<ProductValidators.DeleteOutput>
}
