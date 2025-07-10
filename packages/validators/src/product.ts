import * as z from 'zod/v4'

export const allSchema = z.object({
  query: z.string().optional(),
  category: z
    .preprocess((val) => {
      if (typeof val === 'string' && val.trim() === '') return undefined
      return val
    }, z.cuid2().optional())
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z
    .enum(['name', 'price', 'createdAt', 'updatedAt'])
    .default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export const byIdSchema = z.object({
  id: z.cuid2(),
  categoryId: z.cuid2().optional(),
})
