import * as z from 'zod/v4'

export const byCategoryIdSchema = z.object({
  id: z.cuid2(),
})

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
})

export const updateCategorySchema = byCategoryIdSchema.extend(
  createCategorySchema.shape,
)
