import * as z from 'zod'

export namespace UserModel {
  const passwordSchema = z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]{8,}$/,
    )

  export const registerBody = z.object({
    email: z.email(),
    username: z.string().min(4).max(30),
    password: passwordSchema,
  })
  export type RegisterBody = z.infer<typeof registerBody>
}
