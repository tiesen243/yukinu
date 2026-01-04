import {
  banners,
  categories,
  vouchers,
  wishlistItems,
  tickets,
} from '@yukinu/db/schema'
import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

import { paginationInput, paginationOutput } from '@/shared'

/* --------------------------------------------------------------------------
 * Convert Drizzle ORM schemas to Zod schemas for validation
 * --------------------------------------------------------------------------
 */

export const bannerSchema = createSelectSchema(banners, {
  id: z.cuid(),
})
export type BannerSchema = z.infer<typeof bannerSchema>

export const categorySchema = createSelectSchema(categories, {
  id: z.cuid(),
  parentId: z.cuid().nullable(),
  image: z.url().nullable(),
})
export type CategorySchema = z.infer<typeof categorySchema>

export const voucherSchema = createSelectSchema(vouchers, {
  id: z.cuid(),
})
export type VoucherSchema = z.infer<typeof voucherSchema>

export const wishlistItemSchema = createSelectSchema(wishlistItems, {
  id: z.cuid(),
  userId: z.cuid(),
  productId: z.cuid(),
})
export type WishlistItemSchema = z.infer<typeof wishlistItemSchema>

export const ticketSchema = createSelectSchema(tickets, {
  id: z.cuid(),
  userId: z.cuid(),
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
    categorySchema.pick({ id: true, name: true }).extend({
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
// (Voucher-related validators can be added here in the future)
//#endregion

//#region Wishlist Items
export const allWishlistItemsInput = wishlistItemSchema.pick({ userId: true })
export type AllWishlistItemsInput = z.infer<typeof allWishlistItemsInput>
export const allWishlistItemsOutput = z.array(
  z.object({
    product: z.object({
      id: z.cuid(),
      name: z.string(),
      price: z.string().regex(/^\d+(\.\d+)?$/),
      image: z.url().nullable(),
    }),
    addedAt: z.date(),
  }),
)
export type AllWishlistItemsOutput = z.infer<typeof allWishlistItemsOutput>

export const toggleWishlistItemInput = wishlistItemSchema.pick({
  userId: true,
  productId: true,
})
export type ToggleWishlistItemInput = z.infer<typeof toggleWishlistItemInput>
export const toggleWishlistItemOutput = z.object({ added: z.boolean() })
export type ToggleWishlistItemOutput = z.infer<typeof toggleWishlistItemOutput>
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
