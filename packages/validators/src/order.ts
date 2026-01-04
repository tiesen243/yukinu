import { orderItems, orders, payments, transactions } from '@yukinu/db/schema'
import { createSelectSchema } from 'drizzle-zod'
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

export const orderSchema = createSelectSchema(orders, {
  userId: z.cuid().nullable(),
  addressId: z.cuid().nullable(),
  voucherId: z.cuid().nullable(),
  totalAmount: currencySchema,
})
export type OrderSchema = z.infer<typeof orderSchema>

export const orderStatuses = orderSchema.shape.status.options
export type OrderStatus = z.infer<typeof orderStatuses>

export const orderItemSchema = createSelectSchema(orderItems, {
  id: z.cuid(),
  vendorId: z.cuid().nullable(),
  productId: z.cuid().nullable(),
  productVariantId: z.cuid().nullable(),
  unitPrice: currencySchema,
  note: (schema) => schema.max(500),
})
export type OrderItemSchema = z.infer<typeof orderItemSchema>

export const paymentSchema = createSelectSchema(payments, {
  id: z.cuid(),
  amount: currencySchema,
})
export type PaymentSchema = z.infer<typeof paymentSchema>

export const paymentMethods = paymentSchema.shape.method.options
export type PaymentMethod = z.infer<typeof paymentMethods>

export const paymentStatuses = paymentSchema.shape.status.options
export type PaymentStatus = z.infer<typeof paymentStatuses>

export const transactionSchema = createSelectSchema(transactions, {
  id: z.cuid(),
  paymentId: z.cuid(),
  amountIn: currencySchema,
  amountOut: currencySchema,
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
export const addItemToCartOutput = z.void()
export type AddItemToCartOutput = z.infer<typeof addItemToCartOutput>

export const removeItemFromCartInput = z.object({
  userId: z.cuid(),
  itemId: z.cuid(),
})
export type RemoveItemFromCartInput = z.infer<typeof removeItemFromCartInput>
export const removeItemFromCartOutput = z.void()
export type RemoveItemFromCartOutput = z.infer<typeof removeItemFromCartOutput>
