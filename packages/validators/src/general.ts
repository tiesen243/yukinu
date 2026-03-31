import * as z from 'zod'

import { currencySchema, paginationInput, paginationOutput } from '@/shared'

/* --------------------------------------------------------------------------
 * Convert Drizzle ORM schemas to Zod schemas for validation
 * --------------------------------------------------------------------------
 */

export const ticketStatuses = ['open', 'resolved', 'closed'] as const
export type TicketStatus = (typeof ticketStatuses)[number]

export const bannerSchema = z.object({
  id: z.cuid(),
  url: z.url().max(500),
  createdAt: z.date(),
})
export type BannerSchema = z.infer<typeof bannerSchema>

export const categorySchema = z.object({
  id: z.cuid(),
  parentId: z.cuid().nullable(),
  name: z.string().max(100),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .nullable(),
  image: z.url().max(500).nullable(),
})
export type CategorySchema = z.infer<typeof categorySchema>

export const voucherSchema = z.object({
  id: z.cuid(),
  code: z.string().min(4).max(50),
  discountAmount: z.union([currencySchema, z.literal('')]).nullable(),
  discountPercentage: z.number().int().min(0).max(100).nullable(),
  expiryDate: z.date(),
  quantity: z.number().int(),
})
export type VoucherSchema = z.infer<typeof voucherSchema>

export const ticketSchema = z.object({
  id: z.cuid(),
  userId: z.cuid(),
  subject: z.string().min(1).max(255),
  description: z.string().min(1).max(2000),
  status: z.enum(ticketStatuses).default('open'),
  createdAt: z.date(),
})
export type TicketSchema = z.infer<typeof ticketSchema>

/* --------------------------------------------------------------------------
 * Contract schemas for service inputs and outputs
 * --------------------------------------------------------------------------
 */

//#region Banners
export const allBannersInput = z.void()
export type AllBannersInput = z.infer<typeof allBannersInput>
export const allBannersOutput = z.array(bannerSchema.omit({ createdAt: true }))
export type AllBannersOutput = z.infer<typeof allBannersOutput>

export const createBannerInput = bannerSchema.pick({ url: true })
export type CreateBannerInput = z.infer<typeof createBannerInput>
export const createBannerOutput = bannerSchema.pick({ id: true })
export type CreateBannerOutput = z.infer<typeof createBannerOutput>

export const deleteBannerInput = bannerSchema.pick({ id: true })
export type DeleteBannerInput = z.infer<typeof deleteBannerInput>
export const deleteBannerOutput = bannerSchema.pick({ id: true })
export type DeleteBannerOutput = z.infer<typeof deleteBannerOutput>
//#endregion

//#region Categories
export const allCategoriesInput = paginationInput.extend({
  search: z.string().nullable(),
  isTopLevelOnly: z.boolean().default(false),
})
export type AllCategoriesInput = z.infer<typeof allCategoriesInput>
export const allCategoriesOutput = z.object({
  categories: z.array(
    categorySchema.pick({ id: true, name: true, image: true }).extend({
      parent: categorySchema.pick({ id: true, name: true }).nullable(),
    }),
  ),
  pagination: paginationOutput,
})
export type AllCategoriesOutput = z.infer<typeof allCategoriesOutput>

export const oneCategoryInput = categorySchema.pick({ id: true })
export type OneCategoryInput = z.infer<typeof oneCategoryInput>
export const oneCategoryOutput = categorySchema
  .omit({ parentId: true })
  .extend({
    parent: categorySchema.pick({ id: true, name: true }).nullable(),
  })
export type OneCategoryOutput = z.infer<typeof oneCategoryOutput>

export const createCategoryInput = categorySchema.omit({ id: true })
export type CreateCategoryInput = z.infer<typeof createCategoryInput>
export const createCategoryOutput = categorySchema.pick({ id: true })
export type CreateCategoryOutput = z.infer<typeof createCategoryOutput>

export const updateCategoryInput = categorySchema
export type UpdateCategoryInput = z.infer<typeof updateCategoryInput>
export const updateCategoryOutput = categorySchema.pick({ id: true })
export type UpdateCategoryOutput = z.infer<typeof updateCategoryOutput>

export const deleteCategoryInput = categorySchema.pick({ id: true })
export type DeleteCategoryInput = z.infer<typeof deleteCategoryInput>
export const deleteCategoryOutput = categorySchema.pick({ id: true })
export type DeleteCategoryOutput = z.infer<typeof deleteCategoryOutput>
//#endregion

//#region Vouchers
export const allVouchersInput = paginationInput.extend({
  search: z.string().nullable(),
})
export type AllVouchersInput = z.infer<typeof allVouchersInput>
export const allVouchersOutput = z.object({
  vouchers: z.array(voucherSchema),
  pagination: paginationOutput,
})
export type AllVouchersOutput = z.infer<typeof allVouchersOutput>

export const oneVoucherInput = voucherSchema
  .pick({ id: true, code: true })
  .partial()
export type OneVoucherInput = z.infer<typeof oneVoucherInput>
export const oneVoucherOutput = voucherSchema
export type OneVoucherOutput = z.infer<typeof oneVoucherOutput>

export const createVoucherInput = voucherSchema
  .omit({ id: true, expiryDate: true })
  .extend({ expiryDate: z.iso.date() })
export type CreateVoucherInput = z.infer<typeof createVoucherInput>
export const createVoucherOutput = voucherSchema.pick({ id: true })
export type CreateVoucherOutput = z.infer<typeof createVoucherOutput>

export const updateVoucherInput = voucherSchema
  .omit({ expiryDate: true })
  .extend({ expiryDate: z.iso.date() })
export type UpdateVoucherInput = z.infer<typeof updateVoucherInput>
export const updateVoucherOutput = voucherSchema.pick({ id: true })
export type UpdateVoucherOutput = z.infer<typeof updateVoucherOutput>

export const deleteVoucherInput = voucherSchema.pick({ id: true })
export type DeleteVoucherInput = z.infer<typeof deleteVoucherInput>
export const deleteVoucherOutput = voucherSchema.pick({ id: true })
export type DeleteVoucherOutput = z.infer<typeof deleteVoucherOutput>
//#endregion

//#region Tickets
export const allTicketsInput = ticketSchema
  .pick({ userId: true, status: true })
  .extend(paginationInput.shape)
export type AllTicketsInput = z.infer<typeof allTicketsInput>
export const allTicketsOutput = z.object({
  tickets: z.array(ticketSchema),
  pagination: paginationOutput,
})
export type AllTicketsOutput = z.infer<typeof allTicketsOutput>

export const oneTicketInput = ticketSchema.pick({ id: true })
export type OneTicketInput = z.infer<typeof oneTicketInput>
export const oneTicketOutput = ticketSchema
export type OneTicketOutput = z.infer<typeof oneTicketOutput>

export const createTicketInput = ticketSchema.omit({
  id: true,
  status: true,
  createdAt: true,
})
export type CreateTicketInput = z.infer<typeof createTicketInput>
export const createTicketOutput = ticketSchema.pick({ id: true })
export type CreateTicketOutput = z.infer<typeof createTicketOutput>

export const updateTicketStatusInput = ticketSchema.pick({
  id: true,
  status: true,
})
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusInput>
export const updateTicketStatusOutput = ticketSchema.pick({ id: true })
export type UpdateTicketStatusOutput = z.infer<typeof updateTicketStatusOutput>
//#endregion
