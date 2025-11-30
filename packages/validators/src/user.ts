import * as z from 'zod'

import { ProductValidators } from '@/product'

export namespace UserValidators {
  export const statuses = ['active', 'inactive'] as const
  export type Status = (typeof statuses)[number]

  export const roles = [
    'user',
    'admin',
    'vendor_owner',
    'vendor_staff',
    'moderator',
  ] as const
  export type Role = (typeof roles)[number]

  export const genders = ['male', 'female', 'other'] as const
  export type Gender = (typeof genders)[number]

  export const user = z.object({
    id: z.cuid(),
    username: z.string(),
    email: z.email(),
    emailVerified: z.date().nullable(),
    role: z.enum(roles),
    status: z.enum(statuses),
    image: z.url().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  export type User = z.infer<typeof user>

  export const profile = z.object({
    id: z.cuid(),
    fullName: z.string().min(1).max(255).nullable(),
    bio: z.string().nullable(),
    gender: z.enum(genders).nullable(),
    dateOfBirth: z.iso.date().nullable(),
  })
  export type Profile = z.infer<typeof profile>

  export const address = z.object({
    id: z.cuid(),
    recipientName: z.string().min(1).max(255),
    phoneNumber: z.string().min(1).max(20),
    street: z.string().min(1).max(255),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    postalCode: z.string().min(1).max(20),
    country: z.string().min(1).max(100),
  })
  export type Address = z.infer<typeof address>

  export const wishlistItem = z.object({
    userId: z.cuid(),
    productId: z.cuid(),
    addedAt: z.date(),
  })
  export type WishlistItem = z.infer<typeof wishlistItem>

  export const getUsersInput = z.object({
    search: z.string().optional(),
    status: z.enum(statuses).optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  })
  export type GetUsersInput = z.infer<typeof getUsersInput>
  export const getUsersOutput = z.object({
    users: z.array(user),
    pagination: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    }),
  })
  export type GetUsersOutput = z.infer<typeof getUsersOutput>

  export const getUserInput = z.object({ id: z.cuid() })
  export type GetUserInput = z.infer<typeof getUserInput>
  export const getUserOutput = user
  export type GetUserOutput = z.infer<typeof getUserOutput>

  export const updateStatusInput = user.pick({
    id: true,
    status: true,
    role: true,
  })
  export type UpdateStatusInput = z.infer<typeof updateStatusInput>
  export const updateStatusOutput = z.object({ id: z.cuid() })
  export type UpdateStatusOutput = z.infer<typeof updateStatusOutput>

  export const getProfileInput = z.object({ userId: z.cuid() })
  export type GetProfileInput = z.infer<typeof getProfileInput>
  export const getProfileOutput = user
    .omit({ status: true, updatedAt: true })
    .extend({ profile: profile.omit({ id: true }) })
  export type GetProfileOutput = z.infer<typeof getProfileOutput>

  export const updateProfileInput = profile.extend({ image: user.shape.image })
  export type UpdateProfileInput = z.infer<typeof updateProfileInput>
  export const updateProfileOutput = z.object({ id: z.cuid() })
  export type UpdateProfileOutput = z.infer<typeof updateProfileOutput>

  export const getAddressesInput = z.object({ userId: z.cuid() })
  export type GetAddressesInput = z.infer<typeof getAddressesInput>
  export const getAddressesOutput = z.object({
    addresses: z.array(address),
  })
  export type GetAddressesOutput = z.infer<typeof getAddressesOutput>

  export const getAddressInput = z.object({ id: z.cuid() })
  export type GetAddressInput = z.infer<typeof getAddressInput>
  export const getAddressOutput = address
  export type GetAddressOutput = z.infer<typeof getAddressOutput>

  export const createAddressInput = address.omit({ id: true })
  export type CreateAddressInput = z.infer<typeof createAddressInput>
  export const createAddressOutput = z.object({ id: z.cuid() })
  export type CreateAddressOutput = z.infer<typeof createAddressOutput>

  export const updateAddressInput = createAddressInput.extend({ id: z.cuid() })
  export type UpdateAddressInput = z.infer<typeof updateAddressInput>
  export const updateAddressOutput = z.object({ id: z.cuid() })
  export type UpdateAddressOutput = z.infer<typeof updateAddressOutput>

  export const deleteAddressInput = z.object({ id: z.cuid() })
  export type DeleteAddressInput = z.infer<typeof deleteAddressInput>
  export const deleteAddressOutput = z.object({ id: z.cuid() })
  export type DeleteAddressOutput = z.infer<typeof deleteAddressOutput>

  export const getWishlistInput = z.object({ userId: z.cuid() })
  export type GetWishlistInput = z.infer<typeof getWishlistInput>
  export const getWishlistOutput = z.object({
    items: z.array(
      wishlistItem.extend({
        product: ProductValidators.product.pick({
          id: true,
          name: true,
          price: true,
        }),
      }),
    ),
  })
  export type GetWishlistOutput = z.infer<typeof getWishlistOutput>

  export const toggleWishlistItemInput = z.object({ productId: z.cuid() })
  export type ToggleWishlistItemInput = z.infer<typeof toggleWishlistItemInput>
  export const toggleWishlistItemOutput = z.object({ added: z.boolean() })
  export type ToggleWishlistItemOutput = z.infer<
    typeof toggleWishlistItemOutput
  >
}
