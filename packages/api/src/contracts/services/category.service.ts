import type { CategoryModels } from '@yukinu/validators/category'

export interface ICategoryService {
  /**
   * Get all categories
   * @param input - The pagination and filtering data
   * @example
   * {
   *  page: 1,
   *  limit: 10,
   * }
   * @returns A list of all categories
   */
  all(input: CategoryModels.AllInput): Promise<CategoryModels.AllOutput>

  /**
   * Get a single category by ID
   * @param input - The data containing the category ID
   * @example
   * {
   *   id: 'category-id'
   * }
   * @returns The category's information
   */
  one(input: CategoryModels.OneInput): Promise<CategoryModels.OneOutput>

  /**
   * Create a new category
   * @param input - The data to create the category with
   * @example
   * {
   *   name: 'New Category',
   * }
   * @returns The ID of the newly created category
   */
  create(
    input: CategoryModels.CreateInput,
  ): Promise<CategoryModels.CreateOutput>

  /**
   * Update an existing category
   * @param input - The data to update the category with
   * @example
   * {
   *   id: 'category-id',
   *   name: 'Updated Category Name',
   * }
   * @returns The ID of the updated category
   */
  update(
    input: CategoryModels.UpdateInput,
  ): Promise<CategoryModels.UpdateOutput>

  /**
   * Delete a category
   * @param input - The data containing the category ID to delete
   * @example
   * {
   *   id: 'category-id'
   * }
   * @returns The ID of the deleted category
   */
  delete(
    input: CategoryModels.DeleteInput,
  ): Promise<CategoryModels.DeleteOutput>
}
