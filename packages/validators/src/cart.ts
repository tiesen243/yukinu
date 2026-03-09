import * as z from 'zod'

import { currencySchema } from '@/shared'

export const cartItemSchema = z.object({
  id: z.cuid(),
  userId: z.cuid(),
  productId: z.cuid(),
  productVariantId: z.cuid().nullable(),
  quantity: z.number().int().min(1),
})
export type CartItemSchema = z.infer<typeof cartItemSchema>

export const getInput = z.object({
  userId: z.cuid(),
})
export type GetInput = z.infer<typeof getInput>
export const getOutput = z.object({
  items: z.array(
    cartItemSchema.omit({ userId: true }).extend({
      productName: z.string(),
      productImage: z.url().nullable(),
      productPrice: currencySchema,
      productStock: z.number().int(),
      variant: z.record(z.string(), z.string()),
    }),
  ),
  totalAmount: currencySchema,
})
export type GetOutput = z.infer<typeof getOutput>

export const addItemToCartInput = z.object({
  userId: z.cuid(),
  productId: z.cuid(),
  productVariantId: z.cuid().nullable(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
})
export type AddItemToCartInput = z.infer<typeof addItemToCartInput>
export const addItemToCartOutput = cartItemSchema.shape.id
export type AddItemToCartOutput = z.infer<typeof addItemToCartOutput>

export const removeItemFromCartInput = z.object({
  userId: z.cuid(),
  itemId: z.cuid(),
})
export type RemoveItemFromCartInput = z.infer<typeof removeItemFromCartInput>
export const removeItemFromCartOutput = cartItemSchema.shape.id
export type RemoveItemFromCartOutput = z.infer<typeof removeItemFromCartOutput>
