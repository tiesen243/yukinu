import { auth } from '@yukinu/auth'
import { db } from '@yukinu/db'

import type { TRPCContext } from '@/types'
import { AccountRepository } from '@/repositories/account.repository'
import { ProfileRepository } from '@/repositories/profile.repository'
import { UserRepository } from '@/repositories/user.repository'
import { VendorRepository } from '@/repositories/vendor.repository'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { VendorService } from '@/services/vendor.service'

export const createTRPCContext = async (request: {
  headers: Headers
}): Promise<TRPCContext> => {
  const headers = request.headers
  const session = await auth(request)

  const accountRepo = new AccountRepository(db)
  const profileRepo = new ProfileRepository(db)
  const userRepo = new UserRepository(db)

  const vendorRepo = new VendorRepository(db)

  const authService = new AuthService(db, accountRepo, profileRepo, userRepo)
  const userService = new UserService(db, profileRepo, userRepo)
  const vendorService = new VendorService(db, userRepo, vendorRepo)

  return {
    headers,
    session,

    authService,
    userService,
    vendorService,
  }
}
