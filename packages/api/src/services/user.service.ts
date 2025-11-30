import { TRPCError } from '@trpc/server'

import type { UserValidators } from '@yukinu/validators/user'

import type { IUserService } from '@/contracts/services/user.service'
import { BaseService } from '@/services/base.service'

export class UserService extends BaseService implements IUserService {
  updateStatus(
    _input: UserValidators.UpdateStatusInput,
  ): Promise<UserValidators.UpdateStatusOutput> {
    throw new Error('Method not implemented.')
  }

  async getProfile(
    input: UserValidators.GetProfileInput,
  ): Promise<UserValidators.GetProfileOutput> {
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

  getAddresses(
    _input: UserValidators.GetAddressesInput,
  ): Promise<UserValidators.GetAddressesOutput> {
    throw new Error('Method not implemented.')
  }

  getAddress(
    _input: UserValidators.GetAddressInput,
  ): Promise<UserValidators.GetAddressOutput> {
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

  getWishlist(
    _input: UserValidators.GetWishlistInput,
  ): Promise<UserValidators.GetWishlistOutput> {
    throw new Error('Method not implemented.')
  }

  toggleWishlistItem(
    _input: UserValidators.ToggleWishlistItemInput,
  ): Promise<UserValidators.ToggleWishlistItemOutput> {
    throw new Error('Method not implemented.')
  }
}
