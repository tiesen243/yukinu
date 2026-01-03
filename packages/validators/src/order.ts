import {
  addresses,
  orderItems,
  orders,
  payments,
  transactions,
  vouchers,
} from '@yukinu/db/schema'
import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

export namespace OrderValidators {
  /* --------------------------------------------------------------------------
   * Convert Drizzle ORM schemas to Zod schemas for validation
   * --------------------------------------------------------------------------
   */

  export const orderSchema = createSelectSchema(orders, {
    userId: z.cuid().nullable(),
    addressId: z.cuid().nullable(),
    voucherId: z.cuid().nullable(),
    totalAmount: (schema) =>
      schema.regex(/^(?:\d{1,8})(?:\.\d{1,2})?$/, 'Invalid amount format'),
  })
  export type OrderSchema = z.infer<typeof orderSchema>

  export const orderItemSchema = createSelectSchema(orderItems, {
    id: z.cuid(),
    vendorId: z.cuid().nullable(),
    productId: z.cuid().nullable(),
    productVariantId: z.cuid().nullable(),
    unitPrice: (schema) =>
      schema.regex(/^(?:\d{1,8})(?:\.\d{1,2})?$/, 'Invalid price format'),
    note: (schema) => schema.max(500),
  })
  export type OrderItemSchema = z.infer<typeof orderItemSchema>

  export const paymentSchema = createSelectSchema(payments, {
    id: z.cuid(),
    amount: (schema) =>
      schema.regex(/^(?:\d{1,8})(?:\.\d{1,2})?$/, 'Invalid amount format'),
  })
  export type PaymentSchema = z.infer<typeof paymentSchema>

  export const transactionSchema = createSelectSchema(transactions, {
    id: z.cuid(),
    paymentId: z.cuid(),
    amountIn: (schema) =>
      schema.regex(/^(?:\d{1,10})(?:\.\d{1,2})?$/, 'Invalid amount format'),
    amountOut: (schema) =>
      schema.regex(/^(?:\d{1,10})(?:\.\d{1,2})?$/, 'Invalid amount format'),
  })
  export type TransactionSchema = z.infer<typeof transactionSchema>

  const addressSchema = createSelectSchema(addresses, { id: z.cuid() })
  const voucherSchema = createSelectSchema(vouchers, { id: z.cuid() })

  /* --------------------------------------------------------------------------
   * Contract schemas for service inputs and outputs
   * --------------------------------------------------------------------------
   */

  export const allOrdersInput = z.object({
    userId: z.cuid().optional(),
    vendorId: z.cuid().optional(),
  })
  export type AllInput = z.infer<typeof allOrdersInput>
  export const allOrdersOutput = z.array(orderSchema)
  export type AllOutput = z.infer<typeof allOrdersOutput>

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
    id: orderSchema.shape.id,
    addressId: addressSchema.shape.id,
    voucherCode: voucherSchema.shape.code.optional(),
    paymentMethod: paymentSchema.shape.method,
  })
  export type CheckoutInput = z.infer<typeof checkoutInput>
  export const checkoutOutput = z.void()
  export type CheckoutOutput = z.infer<typeof checkoutOutput>

  export const updateInput = z.object({
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
    unitPrice: z
      .string()
      .regex(/^(?:\d{1,8})(?:\.\d{1,2})?$/, 'Invalid price format'),
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
  export type RemoveItemFromCartOutput = z.infer<
    typeof removeItemFromCartOutput
  >
}
