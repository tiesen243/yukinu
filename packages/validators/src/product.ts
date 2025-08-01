import * as z from 'zod/v4'

export const allProductSchema = z.object({
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

export const byProductIdOrCategoryIdSchema = z.object({
  id: z.cuid2(),
  categoryId: z.cuid2().optional(),
})

export const createProductSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  image: z.url(),
  stock: z.coerce.number().int().min(0).default(0),
  price: z.coerce.string().min(0).default('0'),
  categoryId: z.cuid2(),
})

export const updateProductSchema = createProductSchema.extend({
  id: z.cuid2(),
  discount: z.coerce.number().int().min(0).default(0),
})
