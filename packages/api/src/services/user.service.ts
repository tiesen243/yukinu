import { TRPCError } from '@trpc/server'

import type { UserValidators } from '@yukinu/validators/user'

import type { IUserService } from '@/contracts/services/user.service'
import { BaseService } from '@/services/base.service'

export class UserService extends BaseService implements IUserService {
  async all(input: UserValidators.AllInput): Promise<UserValidators.AllOutput> {
    const { and, asc, eq, ilike, or } = this._orm
    const { users } = this._schema
    const { search, status, role, page, limit } = input
    const offset = (page - 1) * limit

    const whereClauses = []
    if (search)
      whereClauses.push(
        or(
          ilike(users.username, `%${search}%`),
          ilike(users.email, `%${search}%`),
        ),
      )
    if (status) whereClauses.push(eq(users.status, status))
    if (role) whereClauses.push(eq(users.role, role))
    const whereClause = whereClauses.length ? and(...whereClauses) : undefined

    const [usersList, total] = await Promise.all([
      this._db
        .select()
        .from(users)
        .where(whereClause)
        .orderBy(asc(users.username))
        .offset(offset)
        .limit(limit),
      this._db.$count(users, whereClause),
    ])
    const totalPages = Math.ceil(total / limit)

    return {
      users: usersList,
      pagination: { total, page, limit, totalPages },
    }
  }

  async one(input: UserValidators.OneInput): Promise<UserValidators.OneOutput> {
    const { eq } = this._orm
    const { users } = this._schema
    const { id } = input

    const [user] = await this._db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    return user
  }

  async update(
    input: UserValidators.UpdateInput,
  ): Promise<UserValidators.UpdateOutput> {
    const { eq } = this._orm
    const { users } = this._schema
    const { id, status, role } = input

    const [updated] = await this._db
      .update(users)
      .set({ status, role })
      .where(eq(users.id, id))
      .returning({ id: users.id })
    if (!updated)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    return { id }
  }

  async delete(
    input: UserValidators.DeleteInput,
    userId: UserValidators.User['id'],
  ): Promise<UserValidators.DeleteOutput> {
    const { eq } = this._orm
    const { users } = this._schema
    const { id } = input

    if (id === userId)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You cannot delete your own account',
      })

    const [targetUser] = await this._db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (!targetUser)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    const criticalRoles = ['admin', 'moderator', 'vendor_owner', 'vendor_staff']
    if (criticalRoles.includes(targetUser.role))
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You cannot delete users with critical roles (${criticalRoles.join(', ')})`,
      })

    await this._db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id })

    return { id }
  }

  async profile(
    input: UserValidators.ProfileInput,
  ): Promise<UserValidators.ProfileOutput> {
    const { eq } = this._orm
    const { users, profiles } = this._schema
    const { userId } = input

    const [profile] = await this._db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        emailVerified: users.emailVerified,
        image: users.image,
        role: users.role,
        createdAt: users.createdAt,
        profile: {
          fullName: profiles.fullName,
          bio: profiles.bio,
          gender: profiles.gender,
          dateOfBirth: profiles.dateOfBirth,
        },
      })
      .from(users)
      .where(eq(users.id, userId))
      .innerJoin(profiles, eq(profiles.id, users.id))
      .limit(1)
    if (!profile)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' })

    return profile
  }

  updateProfile(
    input: UserValidators.UpdateProfileInput,
  ): Promise<UserValidators.UpdateProfileOutput> {
    const { eq } = this._orm
    const { profiles, users } = this._schema
    const { id, image, ...data } = input

    return this._db.transaction(async (tx) => {
      await tx
        .update(profiles)
        .set({ ...data })
        .where(eq(profiles.id, id))

      await tx.update(users).set({ image }).where(eq(users.id, id))

      return { id }
    })
  }

  async allAddresses(
    input: UserValidators.AllAddressesInput,
  ): Promise<UserValidators.AllAddressesOutput> {
    const { eq, desc } = this._orm
    const { addresses } = this._schema
    const { userId } = input

    const addressesList = await this._db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId))
      .orderBy(desc(addresses.recipientName))

    return { addresses: addressesList }
  }

  async oneAddress(
    input: UserValidators.OneAddressInput,
  ): Promise<UserValidators.OneAddressOutput> {
    const { and, eq } = this._orm
    const { addresses } = this._schema
    const { id, userId } = input

    const [address] = await this._db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
      .limit(1)

    if (!address)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Address not found' })

    return address
  }

  async createAddress(
    input: UserValidators.CreateAddressInput,
  ): Promise<UserValidators.CreateAddressOutput> {
    const { addresses } = this._schema

    const [address] = await this._db
      .insert(addresses)
      .values({ ...input })
      .returning({ id: addresses.id })

    if (!address)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create address',
      })

    return address
  }

  async updateAddress(
    input: UserValidators.UpdateAddressInput,
  ): Promise<UserValidators.UpdateAddressOutput> {
    const { and, eq } = this._orm
    const { addresses } = this._schema
    const { id, userId, ...data } = input

    await this._db
      .update(addresses)
      .set({ ...data })
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))

    return { id }
  }

  async deleteAddress(
    input: UserValidators.DeleteAddressInput,
  ): Promise<UserValidators.DeleteAddressOutput> {
    const { and, eq } = this._orm
    const { addresses } = this._schema
    const { id, userId } = input

    await this._db
      .delete(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))

    return { id }
  }

  async wishlist(
    input: UserValidators.WishlistInput,
  ): Promise<UserValidators.WishlistOutput> {
    const { eq, min } = this._orm
    const { wishlistItems, products, productImages } = this._schema
    const { userId } = input

    return this._db
      .select({
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
          image: min(productImages.url),
        },
        addedAt: wishlistItems.addedAt,
      })
      .from(wishlistItems)
      .where(eq(wishlistItems.userId, userId))
      .innerJoin(products, eq(products.id, wishlistItems.productId))
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .groupBy(wishlistItems.addedAt, products.id)
  }

  async toggleWishlistItem(
    input: UserValidators.ToggleWishlistItemInput,
  ): Promise<UserValidators.ToggleWishlistItemOutput> {
    const { and, eq } = this._orm
    const { wishlistItems } = this._schema
    const { userId, productId } = input

    const whereClause = and(
      eq(wishlistItems.userId, userId),
      eq(wishlistItems.productId, productId),
    )

    const [existingItem] = await this._db
      .select()
      .from(wishlistItems)
      .where(whereClause)
      .limit(1)

    if (existingItem) {
      await this._db.delete(wishlistItems).where(whereClause)
      return { added: false }
    } else {
      await this._db.insert(wishlistItems).values({ userId, productId })
      return { added: true }
    }
  }
}
