import type { GeneralValidators } from '@yukinu/validators/general'

export interface ICategoryService {
  all(
    input: GeneralValidators.AllCategoriesInput,
  ): Promise<GeneralValidators.AllCategoriesOutput>

  one(
    input: GeneralValidators.OneCategoryInput,
  ): Promise<GeneralValidators.OneCategoryOutput>

  create(
    input: GeneralValidators.CreateCategoryInput,
  ): Promise<GeneralValidators.CreateCategoryOutput>

  update(
    input: GeneralValidators.UpdateCategoryInput,
  ): Promise<GeneralValidators.UpdateCategoryOutput>

  delete(
    input: GeneralValidators.DeleteCategoryInput,
  ): Promise<GeneralValidators.DeleteCategoryOutput>
}
