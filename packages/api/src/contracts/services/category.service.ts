import type * as Validators from '@yukinu/validators/general'

export interface ICategoryService {
  all(
    input: Validators.AllCategoriesInput,
  ): Promise<Validators.AllCategoriesOutput>

  one(input: Validators.OneCategoryInput): Promise<Validators.OneCategoryOutput>

  create(
    input: Validators.CreateCategoryInput,
  ): Promise<Validators.CreateCategoryOutput>

  update(
    input: Validators.UpdateCategoryInput,
  ): Promise<Validators.UpdateCategoryOutput>

  delete(
    input: Validators.DeleteCategoryInput,
  ): Promise<Validators.DeleteCategoryOutput>
}
