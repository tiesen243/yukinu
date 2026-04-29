import * as z from 'zod'

export namespace ResetPasswordDto {
  export const input = z.object({
    token: z.string().min(1),
    newPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    userId: z.string().min(1),
  })
  export type Output = z.infer<typeof output>
}
