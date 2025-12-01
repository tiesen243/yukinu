import type { CategoryValidators } from '@yukinu/validators/category'

import type { ICategoryService } from '@/contracts/services/category.service'
import { BaseService } from '@/services/base.service'

export class CategoryService extends BaseService implements ICategoryService {
  all(
    _input: CategoryValidators.AllInput,
  ): Promise<CategoryValidators.AllOutput> {
    throw new Error('Method not implemented.')
  }

  one(
    _input: CategoryValidators.OneInput,
  ): Promise<CategoryValidators.OneOutput> {
    throw new Error('Method not implemented.')
  }

  create(
    _input: CategoryValidators.CreateInput,
  ): Promise<CategoryValidators.CreateOutput> {
    throw new Error('Method not implemented.')
  }

  update(
    _input: CategoryValidators.UpdateInput,
  ): Promise<CategoryValidators.UpdateOutput> {
    throw new Error('Method not implemented.')
  }

  delete(
    _input: CategoryValidators.DeleteInput,
  ): Promise<CategoryValidators.DeleteOutput> {
    throw new Error('Method not implemented.')
  }
}
