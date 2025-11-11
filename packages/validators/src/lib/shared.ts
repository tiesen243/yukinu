import * as z from 'zod'

export const identifierSchema = z
  .string()
  .trim()
  .min(4, 'Identifier too short')
  .max(100, 'Identifier too long')
  .transform((val) => val.toLowerCase())

export const passwordSchema = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
    'Password not strong enough',
  )

export const paginationInputSchema = z.object({
  page: z
    .number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
})

export const paginationOutputSchema = z.object({
  page: z.number().int(),
  totalPages: z.number().int(),
  totalItems: z.number().int(),
})
