import * as z from 'zod'

import { userSchema } from '@/auth'
import { voucherSchema } from '@/general'
import { productSchema } from '@/product'
import { currencySchema, paginationInput, paginationOutput } from '@/shared'
import { addressSchema } from '@/user'

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
export type OrderStatus = (typeof orderStatuses)[number]

export const paymentMethods = ['bank_transfer', 'cash_on_delivery'] as const
export type PaymentMethod = (typeof paymentMethods)[number]

export const paymentStatuses = ['pending', 'success', 'failed'] as const
export type PaymentStatus = (typeof paymentStatuses)[number]

export const orderSchema = z.object({
  id: z.int().min(1000),
  userId: z.cuid().nullable(),
  vendorId: z.cuid().nullable(),
  paymentId: z.cuid(),
  addressId: z.cuid().nullable(),
  totalAmount: currencySchema,
  status: z.enum(orderStatuses).default('pending'),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type OrderSchema = z.infer<typeof orderSchema>

export const orderItemSchema = z.object({
  id: z.cuid(),
  orderId: z.int().min(1000),
  productId: z.cuid().nullable(),
  productVariantId: z.cuid().nullable(),
  quantity: z.number().int().min(1),
  unitPrice: currencySchema,
})
export type OrderItemSchema = z.infer<typeof orderItemSchema>

export const paymentSchema = z.object({
  id: z.cuid(),
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

export const allInput = paginationInput.extend({
  userId: userSchema.shape.id.nullable(),
  vendorId: userSchema.shape.id.nullable(),
  paymentId: paymentSchema.shape.id.nullable(),
})
export type AllInput = z.infer<typeof allInput>
export const allOutput = z.object({
  orders: z.array(
    orderSchema.pick({ id: true, totalAmount: true, status: true }).extend({
      user: userSchema.pick({ id: true, username: true }).nullable(),
      items: z.array(
        orderItemSchema
          .pick({ productId: true, quantity: true, unitPrice: true })
          .extend({
            productImage: z.url().nullable(),
            productName: productSchema.shape.name.nullable(),
          }),
      ),
    }),
  ),
  pagination: paginationOutput,
})
export type AllOutput = z.infer<typeof allOutput>

export const oneInput = z.object({
  id: orderSchema.shape.id,
})
export type OneInput = z.infer<typeof oneInput>
export const oneOutput = orderSchema
  .omit({ userId: true, vendorId: true, addressId: true, paymentId: true })
  .extend({
    user: userSchema.pick({ id: true, username: true, email: true }).nullable(),
    address: addressSchema.omit({ userId: true }).nullable(),
    items: z.array(
      orderItemSchema
        .pick({ productId: true, quantity: true, unitPrice: true })
        .extend({
          productImage: z.url().nullable(),
          productName: productSchema.shape.name.nullable(),
        }),
    ),
  })
export type OneOutput = z.infer<typeof oneOutput>

export const checkoutInput = z.object({
  userId: userSchema.shape.id,
  addressId: addressSchema.shape.id,
  paymentMethod: z.enum(paymentMethods),
  voucherId: voucherSchema.shape.id.nullable(),
})
export type CheckoutInput = z.infer<typeof checkoutInput>
export const checkoutOutput = z.object({
  orderIds: z.array(orderSchema.shape.id),
})
export type CheckoutOutput = z.infer<typeof checkoutOutput>
