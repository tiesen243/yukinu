import * as z from 'zod'

export namespace SaveAddressDto {
  export const input = z.object({
    id: z.cuid2().optional(),
    userId: z.cuid2(),
    recipientName: z
      .string()
      .max(255, 'Recipient name must be at most 255 characters long'),
    phoneNumber: z
      .string()
      .regex(
        /(?:\(\+[0-9]{1,3}\)|\+[0-9]{1,3}|0)[ .-]?[0-9]{2,4}[ .-]?[0-9]{2,4}[ .-]?[0-9]{3,4}/,
        'Invalid phone number',
      ),
    street: z
      .string()
      .min(5, 'Street must be at least 5 characters long')
      .max(255, 'Street must be at most 255 characters long'),
    city: z
      .string()
      .min(2, 'City must be at least 2 characters long')
      .max(100, 'City must be at most 100 characters long'),
    state: z
      .string()
      .min(2, 'State must be at least 2 characters long')
      .max(100, 'State must be at most 100 characters long'),
    postalCode: z
      .string()
      .regex(
        /^[A-Za-z0-9][A-Za-z0-9\- ]{1,8}[A-Za-z0-9]$/,
        'Invalid postal code',
      ),
    country: z.string().max(100, 'Country must be at most 100 characters long'),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
