import * as z from 'zod'

export namespace InviteStaffDto {
  export const input = z.object({ vendorId: z.cuid2(), email: z.email() })
  export type Input = z.infer<typeof input>

  export const output = z.object({ userId: z.cuid2() })
  export type Output = z.infer<typeof output>
}
