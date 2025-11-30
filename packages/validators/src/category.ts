import * as z from 'zod'

export namespace CategoryValidators {
  export const category = z.object({
    id: z.cuid(),
    name: z.string().min(1).max(255),
    image: z.url().optional(),
  })
  export type Category = z.infer<typeof category>

  export const getCategoriesInput = z.object({
    search: z.string().optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  })
  export type GetCategoriesInput = z.infer<typeof getCategoriesInput>
  export const getCategoriesOutput = z.object({
    categories: z.array(category),
    pagination: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    }),
  })
  export type GetCategoriesOutput = z.infer<typeof getCategoriesOutput>

  export const getCategoryInput = z.object({ id: z.cuid() })
  export type GetCategoryInput = z.infer<typeof getCategoryInput>
  export const getCategoryOutput = category
  export type GetCategoryOutput = z.infer<typeof getCategoryOutput>

  export const createCategoryInput = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().optional(),
    image: z.url('Invalid image URL').optional(),
  })
  export type CreateCategoryInput = z.infer<typeof createCategoryInput>
  export const createCategoryOutput = z.object({ id: z.cuid() })
  export type CreateCategoryOutput = z.infer<typeof createCategoryOutput>

  export const updateCategoryInput = createCategoryInput.extend({
    id: z.cuid(),
  })
  export type UpdateCategoryInput = z.infer<typeof updateCategoryInput>
  export const updateCategoryOutput = z.object({ id: z.cuid() })
  export type UpdateCategoryOutput = z.infer<typeof updateCategoryOutput>

  export const deleteCategoryInput = z.object({ id: z.cuid() })
  export type DeleteCategoryInput = z.infer<typeof deleteCategoryInput>
  export const deleteCategoryOutput = z.object({ id: z.cuid() })
  export type DeleteCategoryOutput = z.infer<typeof deleteCategoryOutput>
}
