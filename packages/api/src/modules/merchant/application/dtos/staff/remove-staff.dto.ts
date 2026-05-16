import * as z from 'zod'

export namespace RemoveStaffDto {
  export const input = z.object({ vendorId: z.cuid2(), userId: z.cuid2() })
  export type Input = z.infer<typeof input>

  export const output = z.object({ userId: z.cuid2() })
  export type Output = z.infer<typeof output>
}
