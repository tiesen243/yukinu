import * as z from 'zod'

export namespace SignUpDto {
  export const input = z.object({
    email: z.email('Invalid email address'),
    username: z
      .string()
      .regex(
        /^[a-zA-Z0-9._]+$/,
        'Username can only contain letters, numbers, dots and underscores',
      ),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    userId: z.cuid2(),
    verificationToken: z.string().min(1),
  })
  export type Output = z.infer<typeof output>
}
