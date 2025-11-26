import type { ProductModels } from '@yukinu/validators/product'

export interface IProductService {
  all(input: ProductModels.AllInput): Promise<ProductModels.AllOutput>

  one(input: ProductModels.OneInput): Promise<ProductModels.OneOutput>

  create(input: ProductModels.CreateInput): Promise<ProductModels.CreateOutput>

  update(input: ProductModels.UpdateInput): Promise<ProductModels.UpdateOutput>
}
