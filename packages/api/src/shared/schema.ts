import * as z from 'zod'

export namespace Pagination {
  export const input = z.object({
    page: z.int().positive().default(1),
    limit: z.int().positive().default(10),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  })
  export type Output = z.infer<typeof output>
}
