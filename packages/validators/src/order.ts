import * as z from 'zod'

import { userSchema } from '@/auth'
import { voucherSchema } from '@/general'
import { currencySchema } from '@/shared'
import { addressSchema } from '@/user'
import { vendorSchema } from '@/vendor'

/* --------------------------------------------------------------------------
 * Convert Drizzle ORM schemas to Zod schemas for validation
 * --------------------------------------------------------------------------
 */

export const orderStatuses = [
  'pending',
  'confirmed',
  'shipped',
  'completed',
  'cancelled',
] as const
export type OrderStatus = z.infer<typeof orderStatuses>

export const paymentMethods = ['bank_transfer', 'cash_on_delivery'] as const
export type PaymentMethod = z.infer<typeof paymentMethods>

export const paymentStatuses = ['pending', 'success', 'failed'] as const
export type PaymentStatus = z.infer<typeof paymentStatuses>

export const orderSchema = z.object({
  id: z.int().min(1000),
  userId: z.cuid().nullable(),
  addressId: z.cuid().nullable(),
  voucherId: z.cuid().nullable(),
  totalAmount: currencySchema,
  status: z.enum(orderStatuses).default('pending'),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type OrderSchema = z.infer<typeof orderSchema>

export const orderItemSchema = z.object({
  id: z.cuid(),
  orderId: z.int().min(1000),
  vendorId: z.cuid().nullable(),
  productId: z.cuid().nullable(),
  productVariantId: z.cuid().nullable(),
  quantity: z.number().int().min(1),
  unitPrice: currencySchema,
  note: z.string().nullable(),
  isCompleted: z.boolean().default(false),
})
export type OrderItemSchema = z.infer<typeof orderItemSchema>

export const paymentSchema = z.object({
  id: z.cuid(),
  orderId: z.int().min(1000),
  method: z.enum(paymentMethods),
  amount: currencySchema,
  methodReference: z.string().max(255).nullable(),
  status: z.enum(paymentStatuses).default('pending'),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type PaymentSchema = z.infer<typeof paymentSchema>

export const transactionSchema = z.object({
  id: z.cuid(),
  paymentId: z.cuid(),
  gateway: z.string().max(100),
  transactionDate: z.date(),
  amountIn: currencySchema,
  amountOut: currencySchema,
  transactionContent: z.string().nullable(),
  referenceNumber: z.string().max(255).nullable(),
  body: z.string().nullable(),
  createdAt: z.date(),
})
export type TransactionSchema = z.infer<typeof transactionSchema>

/* --------------------------------------------------------------------------
 * Contract schemas for service inputs and outputs
 * --------------------------------------------------------------------------
 */

export const allInput = z.object({
  userId: z.cuid().optional(),
  vendorId: z.cuid().optional(),
})
export type AllInput = z.infer<typeof allInput>
export const allOutput = z.array(orderSchema)
export type AllOutput = z.infer<typeof allOutput>

export const oneInput = z.object({
  id: orderSchema.shape.id.optional(),
  userId: z.cuid().optional(),
  status: orderSchema.shape.status.optional(),
})
export type OneInput = z.infer<typeof oneInput>
export const oneOutput = orderSchema
  .pick({
    id: true,
    userId: true,
    status: true,
    totalAmount: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    address: addressSchema.omit({ id: true, userId: true }).nullable(),
    voucher: voucherSchema.omit({ id: true, expiryDate: true }).nullable(),
    items: z.array(
      orderItemSchema.omit({ orderId: true, isCompleted: true }).extend({
        productName: z.string().nullable(),
        productImage: z.string().nullable(),
        variant: z.record(z.string(), z.string()),

        stock: z.int().min(0).nullable(),
        variantStock: z.int().min(0).nullable(),
      }),
    ),
  })
export type OneOutput = z.infer<typeof oneOutput>

export const checkoutInput = z.object({
  userId: userSchema.shape.id,
  id: orderSchema.shape.id,
  addressId: addressSchema.shape.id,
  voucherCode: voucherSchema.shape.code.optional(),
  paymentMethod: paymentSchema.shape.method,
})
export type CheckoutInput = z.infer<typeof checkoutInput>
export const checkoutOutput = z.void()
export type CheckoutOutput = z.infer<typeof checkoutOutput>

export const updateInput = z.object({
  userId: userSchema.shape.id.optional(),
  vendorId: vendorSchema.shape.id.optional(),
  id: orderSchema.shape.id,
  status: orderSchema.shape.status.optional(),
  paymentStatus: paymentSchema.shape.status.optional(),
  paymentMethod: paymentSchema.shape.method.optional(),
})
export type UpdateInput = z.infer<typeof updateInput>
export const updateOutput = z.void()
export type UpdateOutput = z.infer<typeof updateOutput>

export const addItemToCartInput = z.object({
  userId: z.cuid(),
  vendorId: z.cuid().nullable(),
  productId: z.cuid(),
  variantId: z.cuid().optional(),
  unitPrice: currencySchema,
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
})
export type AddItemToCartInput = z.infer<typeof addItemToCartInput>
export const addItemToCartOutput = orderItemSchema.shape.id
export type AddItemToCartOutput = z.infer<typeof addItemToCartOutput>

export const removeItemFromCartInput = z.object({
  userId: z.cuid(),
  itemId: z.cuid(),
})
export type RemoveItemFromCartInput = z.infer<typeof removeItemFromCartInput>
export const removeItemFromCartOutput = orderItemSchema.shape.id
export type RemoveItemFromCartOutput = z.infer<typeof removeItemFromCartOutput>
