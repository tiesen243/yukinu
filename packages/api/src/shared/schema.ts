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

export const passwordRegex = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
    'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
  )
