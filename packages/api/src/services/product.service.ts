import type { ProductValidators } from '@yukinu/validators/product'

import type { IProductService } from '@/contracts/services/product.service'
import { BaseService } from '@/services/base.service'

export class ProductService extends BaseService implements IProductService {
  all(
    _input: ProductValidators.AllInput,
  ): Promise<ProductValidators.AllOutput> {
    throw new Error('Method not implemented.')
  }

  one(
    _input: ProductValidators.OneInput,
  ): Promise<ProductValidators.OneOutput> {
    throw new Error('Method not implemented.')
  }

  create(
    _input: ProductValidators.CreateInput,
  ): Promise<ProductValidators.CreateOutput> {
    throw new Error('Method not implemented.')
  }

  update(
    _input: ProductValidators.UpdateInput,
  ): Promise<ProductValidators.UpdateOutput> {
    throw new Error('Method not implemented.')
  }

  delete(
    _input: ProductValidators.DeleteInput,
  ): Promise<ProductValidators.DeleteOutput> {
    throw new Error('Method not implemented.')
  }
}
