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
    userId: z.cuid(),
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

  export const allInput = z.object({
    search: z.string().optional(),
    status: z.enum(statuses).optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  })
  export type AllInput = z.infer<typeof allInput>
  export const allOutput = z.object({
    users: z.array(user),
    pagination: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    }),
  })
  export type AllOutput = z.infer<typeof allOutput>

  export const oneInput = z.object({ id: z.cuid() })
  export type OneInput = z.infer<typeof oneInput>
  export const oneOutput = user
  export type OneOutput = z.infer<typeof oneOutput>

  export const updateStatusInput = user.pick({
    id: true,
    status: true,
    role: true,
  })
  export type UpdateStatusInput = z.infer<typeof updateStatusInput>
  export const updateStatusOutput = z.object({ id: z.cuid() })
  export type UpdateStatusOutput = z.infer<typeof updateStatusOutput>

  export const profileInput = z.object({ userId: z.cuid() })
  export type ProfileInput = z.infer<typeof profileInput>
  export const profileOutput = user
    .omit({ status: true, updatedAt: true })
    .extend({ profile: profile.omit({ id: true }) })
  export type ProfileOutput = z.infer<typeof profileOutput>

  export const updateProfileInput = profile.extend({ image: user.shape.image })
  export type UpdateProfileInput = z.infer<typeof updateProfileInput>
  export const updateProfileOutput = z.object({ id: z.cuid() })
  export type UpdateProfileOutput = z.infer<typeof updateProfileOutput>

  export const allAddressesInput = z.object({ userId: z.cuid() })
  export type AllAddressesInput = z.infer<typeof allAddressesInput>
  export const allAddressesOutput = z.object({
    addresses: z.array(address),
  })
  export type AllAddressesOutput = z.infer<typeof allAddressesOutput>

  export const oneAddressInput = z.object({ id: z.cuid(), userId: z.cuid() })
  export type OneAddressInput = z.infer<typeof oneAddressInput>
  export const oneAddressOutput = address
  export type OneAddressOutput = z.infer<typeof oneAddressOutput>

  export const createAddressInput = address.omit({ id: true })
  export type CreateAddressInput = z.infer<typeof createAddressInput>
  export const createAddressOutput = z.object({ id: z.cuid() })
  export type CreateAddressOutput = z.infer<typeof createAddressOutput>

  export const updateAddressInput = createAddressInput.extend({ id: z.cuid() })
  export type UpdateAddressInput = z.infer<typeof updateAddressInput>
  export const updateAddressOutput = z.object({ id: z.cuid() })
  export type UpdateAddressOutput = z.infer<typeof updateAddressOutput>

  export const deleteAddressInput = z.object({ id: z.cuid(), userId: z.cuid() })
  export type DeleteAddressInput = z.infer<typeof deleteAddressInput>
  export const deleteAddressOutput = z.object({ id: z.cuid() })
  export type DeleteAddressOutput = z.infer<typeof deleteAddressOutput>

  export const wishlistInput = z.object({ userId: z.cuid() })
  export type WishlistInput = z.infer<typeof wishlistInput>
  export const wishlistOutput = z.array(
    z.object({
      product: ProductValidators.product
        .pick({ id: true, name: true, price: true })
        .extend({ image: ProductValidators.productImage.shape.url.nullable() }),
      addedAt: z.date(),
    }),
  )
  export type WishlistOutput = z.infer<typeof wishlistOutput>

  export const toggleWishlistItemInput = z.object({
    userId: z.cuid(),
    productId: z.cuid(),
  })
  export type ToggleWishlistItemInput = z.infer<typeof toggleWishlistItemInput>
  export const toggleWishlistItemOutput = z.object({ added: z.boolean() })
  export type ToggleWishlistItemOutput = z.infer<
    typeof toggleWishlistItemOutput
  >
}
