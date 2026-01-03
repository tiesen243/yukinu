import type * as ProductValidators from '@yukinu/validators/product'

export interface IProductVariantService {
  recreate(
    input: ProductValidators.RecreateVariantInput,
  ): Promise<ProductValidators.RecreateVariantOutput>

  update(
    input: ProductValidators.UpdateVariantInput,
  ): Promise<ProductValidators.UpdateVariantOutput>

  delete(
    input: ProductValidators.DeleteVariantInput,
  ): Promise<ProductValidators.DeleteVariantOutput>
}
