import type { CategoryValidators } from '@yukinu/validators/category'

export interface ICategoryService {
  all(input: CategoryValidators.AllInput): Promise<CategoryValidators.AllOutput>

  one(input: CategoryValidators.OneInput): Promise<CategoryValidators.OneOutput>

  create(
    input: CategoryValidators.CreateInput,
  ): Promise<CategoryValidators.CreateOutput>

  update(
    input: CategoryValidators.UpdateInput,
  ): Promise<CategoryValidators.UpdateOutput>

  delete(
    input: CategoryValidators.DeleteInput,
  ): Promise<CategoryValidators.DeleteOutput>
}
