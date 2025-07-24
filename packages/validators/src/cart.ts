import * as z from 'zod/v4'

export const updateCartSchema = z.object({
  productId: z.cuid2(),
  quantity: z.number().int().positive(),
  type: z.enum(['increment', 'replace', 'remove']).default('increment'),
})
