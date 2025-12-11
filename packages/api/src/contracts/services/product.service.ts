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

  restore(
    input: ProductValidators.RestoreInput,
  ): Promise<ProductValidators.RestoreOutput>

  permanentDelete(
    input: ProductValidators.PermanentDeleteInput,
  ): Promise<ProductValidators.PermanentDeleteOutput>

  recreateVariant(
    input: ProductValidators.RecreateVariantInput,
  ): Promise<ProductValidators.RecreateVariantOutput>

  updateVariant(
    input: ProductValidators.UpdateVariantInput,
  ): Promise<ProductValidators.UpdateVariantOutput>

  deleteVariant(
    input: ProductValidators.DeleteVariantInput,
  ): Promise<ProductValidators.DeleteVariantOutput>
}
