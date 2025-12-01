import { TRPCError } from '@trpc/server'

import type { UserValidators } from '@yukinu/validators/user'

import type { IUserService } from '@/contracts/services/user.service'
import { BaseService } from '@/services/base.service'

export class UserService extends BaseService implements IUserService {
  all(_input: UserValidators.AllInput): Promise<UserValidators.AllOutput> {
    throw new Error('Method not implemented.')
  }

  one(_input: UserValidators.OneInput): Promise<UserValidators.OneOutput> {
    throw new Error('Method not implemented.')
  }

  updateStatus(
    _input: UserValidators.UpdateStatusInput,
  ): Promise<UserValidators.UpdateStatusOutput> {
    throw new Error('Method not implemented.')
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
    _input: UserValidators.UpdateProfileInput,
  ): Promise<UserValidators.UpdateProfileOutput> {
    throw new Error('Method not implemented.')
  }

  allAddresses(
    _input: UserValidators.AllAddressesInput,
  ): Promise<UserValidators.AllAddressesOutput> {
    throw new Error('Method not implemented.')
  }

  oneAddress(
    _input: UserValidators.OneAddressInput,
  ): Promise<UserValidators.OneAddressOutput> {
    throw new Error('Method not implemented.')
  }

  createAddress(
    _input: UserValidators.CreateAddressInput,
  ): Promise<UserValidators.CreateAddressOutput> {
    throw new Error('Method not implemented.')
  }

  updateAddress(
    _input: UserValidators.UpdateAddressInput,
  ): Promise<UserValidators.UpdateAddressOutput> {
    throw new Error('Method not implemented.')
  }

  deleteAddress(
    _input: UserValidators.DeleteAddressInput,
  ): Promise<UserValidators.DeleteAddressOutput> {
    throw new Error('Method not implemented.')
  }

  wishlist(
    _input: UserValidators.WishlistInput,
  ): Promise<UserValidators.WishlistOutput> {
    throw new Error('Method not implemented.')
  }

  toggleWishlistItem(
    _input: UserValidators.ToggleWishlistItemInput,
  ): Promise<UserValidators.ToggleWishlistItemOutput> {
    throw new Error('Method not implemented.')
  }
}
