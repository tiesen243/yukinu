import * as z from 'zod'

export namespace OrderValidators {
  const numeric = z.string().regex(/^(?:\d{1,8})(?:\.\d{1,2})?$/, {
    error: 'Invalid price format',
  })

  export const orderStatuses = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'returned',
  ] as const
  export type OrderStatus = (typeof orderStatuses)[number]

  export const paymentMethods = ['bank_transfer', 'cash_on_delivery'] as const
  export type PaymentMethod = (typeof paymentMethods)[number]

  export const paymentStatuses = ['pending', 'completed', 'failed'] as const
  export type PaymentStatus = (typeof paymentStatuses)[number]

  export const order = z.object({
    id: z.number().min(1000, 'ID must be at least 1000'),
    userId: z.cuid().nullable(),
    addressId: z.cuid().nullable(),
    voucherId: z.cuid().nullable(),
    totalAmount: numeric,
    status: z.enum(orderStatuses),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  export type Order = z.infer<typeof order>

  export const orderItem = z.object({
    orderId: z.number().min(1000, 'ID must be at least 1000'),
    productId: z.cuid().nullable(),
    productVariantId: z.cuid().nullable(),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    unitPrice: numeric,
  })
  export type OrderItem = z.infer<typeof orderItem>

  export const transaction = z.object({
    id: z.cuid(),
    orderId: z.number().min(1000, 'ID must be at least 1000'),
    amount: numeric,
    method: z.enum(paymentMethods),
    status: z.enum(paymentStatuses),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  export type Transaction = z.infer<typeof transaction>

  export const voucher = z
    .object({
      id: z.cuid(),
      code: z
        .string()
        .min(1, 'Voucher code is required')
        .max(50, 'Voucher code is too long'),
      discountAmount: numeric.nullable(),
      discountPercentage: z
        .number()
        .min(0, 'Discount percentage cannot be negative')
        .max(100, 'Discount percentage cannot exceed 100')
        .nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
    .refine(
      (data) =>
        data.discountAmount !== null || data.discountPercentage !== null,
      {
        error: 'Either discount amount or discount percentage must be provided',
      },
    )
  export type Voucher = z.infer<typeof voucher>

  export const allInput = z.object({
    userId: z.cuid().optional(),
    vendorId: z.cuid().optional(),
  })
  export type AllInput = z.infer<typeof allInput>
  export const allOutput = z.array(order)
  export type AllOutput = z.infer<typeof allOutput>

  export const oneInput = z.object({
    id: order.shape.id.optional(),
    userId: z.cuid().optional(),
    status: z.enum(orderStatuses).optional(),
  })
  export type OneInput = z.infer<typeof oneInput>
  export const oneOutput = z.object({
    id: order.shape.id,
    userId: order.shape.userId,
    status: order.shape.status,
    totalAmount: order.shape.totalAmount,
    address: z
      .object({
        recipientName: z.string(),
        phoneNumber: z.string(),
        street: z.string(),
        city: z.string(),
        state: z.string(),
        postalCode: z.string(),
        country: z.string(),
      })
      .nullable(),
    transaction: z
      .object({
        id: transaction.shape.id,
        amount: transaction.shape.amount,
        method: transaction.shape.method,
        status: transaction.shape.status,
        updatedAt: transaction.shape.updatedAt,
      })
      .nullable(),
    voucher: z
      .object({
        code: voucher.shape.code,
        discountAmount: voucher.shape.discountAmount,
        discountPercentage: voucher.shape.discountPercentage,
      })
      .nullable(),
    items: z.array(
      z.object({
        id: z.cuid().nullable(),
        productId: z.cuid().nullable(),
        productName: z.string().nullable(),
        productImage: z.string().nullable(),
        productVariantId: z.cuid().nullable(),
        unitPrice: numeric,
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        variant: z.record(z.string(), z.string()),

        stock: z.number().int().min(0).nullable(),
        variantStock: z.number().int().min(0).nullable(),
      }),
    ),
    createdAt: order.shape.createdAt,
    updatedAt: order.shape.updatedAt,
  })
  export type OneOutput = z.infer<typeof oneOutput>

  export const checkoutInput = z.object({
    id: order.shape.id,
    addressId: order.shape.addressId,
    voucherCode: voucher.shape.code.optional(),
    paymentMethod: transaction.shape.method,
  })
  export type CheckoutInput = z.infer<typeof checkoutInput>
  export const checkoutOutput = z.void()
  export type CheckoutOutput = z.infer<typeof checkoutOutput>

  export const updateInput = z.object({
    id: order.shape.id,
    status: z.enum(orderStatuses).optional(),
    paymentStatus: z.enum(paymentStatuses).optional(),
    paymentMethod: z.enum(paymentMethods).optional(),
  })
  export type UpdateInput = z.infer<typeof updateInput>
  export const updateOutput = z.void()
  export type UpdateOutput = z.infer<typeof updateOutput>

  export const addItemToCartInput = z.object({
    userId: z.cuid(),
    productId: z.cuid(),
    variantId: z.cuid().optional(),
    unitPrice: numeric,
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
