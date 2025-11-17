import type { ProductModels } from '@yukinu/validators/product'

export interface IProductService {
  all(input: ProductModels.AllInput): Promise<ProductModels.AllOutput>

  create(input: ProductModels.CreateInput): Promise<ProductModels.CreateOutput>
}
