import * as z from 'zod'

export namespace UserModel {
  const passwordSchema = z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]{8,}$/,
      'Password not strong enough',
    )

  export const registerBody = z
    .object({
      email: z.email('Invalid email address'),
      username: z
        .string()
        .min(4, 'Username must be at least 4 characters')
        .max(30, 'Username must be at most 30 characters'),
      password: passwordSchema,
      confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: "Passwords don't match",
    })
  export type RegisterBody = z.infer<typeof registerBody>

  export const loginBody = z.object({
    identifier: z.union(
      [
        z.email('Invalid email address'),
        z
          .string()
          .min(4, 'Username must be at least 4 characters')
          .max(30, 'Username must be at most 30 characters'),
      ],
      'Identifier must be a valid email or username',
    ),
    password: passwordSchema,
  })
  export type LoginBody = z.infer<typeof loginBody>
}
