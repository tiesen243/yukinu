import * as z from 'zod'

export const paginationInput = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})
export type PaginationInput = z.infer<typeof paginationInput>

export const paginationOutput = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})
export type PaginationOutput = z.infer<typeof paginationOutput>
