import * as z from 'zod'

export namespace SaveVoucherDto {
  export const input = z
    .object({
      id: z.cuid2().optional(),
      code: z.string(),
      discountAmount: z
        .string()
        .transform((val) => (val.trim() === '' ? null : val))
        .nullable(),
      discountPercentage: z
        .number()
        .min(0, 'Discount percentage must be at least 1')
        .max(100, 'Discount percentage cannot exceed 100')
        .transform((val) => (val === 0 ? null : val))
        .nullable(),
      quantity: z.number(),
      expiredAt: z.coerce.date(),
    })
    .refine(
      (data) =>
        (data.discountAmount !== null) !== (data.discountPercentage !== null),
      {
        path: ['discountAmount', 'discountPercentage'],
        message:
          'Must provide either discountAmount or discountPercentage, but not both',
      },
    )
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.cuid2() })
  export type Output = z.infer<typeof output>
}
