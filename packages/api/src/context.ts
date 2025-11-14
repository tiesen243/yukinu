import { auth } from '@yukinu/auth'
import { db } from '@yukinu/db'

import type { TRPCContext } from '@/types'
import { AccountRepository } from '@/repositories/account.repository'
import { AddressRepository } from '@/repositories/address.repository'
import { ProfileRepository } from '@/repositories/profile.repository'
import { UserRepository } from '@/repositories/user.repository'
import { VendorRepository } from '@/repositories/vendor.repository'
import { AddressService } from '@/services/address.service'
import { AuthService } from '@/services/auth.service'
import { ProfileService } from '@/services/profile.service'
import { UserService } from '@/services/user.service'
import { VendorService } from '@/services/vendor.service'

export const createTRPCContext = async (options: {
  headers: Headers
}): Promise<TRPCContext> => {
  const session = await auth(options)

  const account = new AccountRepository(db)
  const address = new AddressRepository(db)
  const profile = new ProfileRepository(db)
  const user = new UserRepository(db)
  const vendor = new VendorRepository(db)

  const authService = new AuthService(db, account, profile, user)
  const addressService = new AddressService(db, address)
  const profileService = new ProfileService(db, profile)
  const userService = new UserService(db, profile, user)
  const vendorService = new VendorService(db, user, vendor)

  return {
    headers: options.headers,

    session,

    addressService,
    authService,
    profileService,
    userService,
    vendorService,
  }
}
