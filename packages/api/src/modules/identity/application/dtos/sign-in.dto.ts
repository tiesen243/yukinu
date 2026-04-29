import * as z from 'zod'

export namespace SignInDto {
  export const input = z.object({
    identifier: z.string().min(1, 'Identifier is required'),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
    expiresAt: z.date(),
  })
  export type Output = z.infer<typeof output>
}
