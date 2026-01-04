import type { TRPCContext } from '@/types'

import { validateAccessToken } from '@yukinu/auth'
import { db, orm } from '@yukinu/db'
import * as schema from '@yukinu/db/schema'

import { AccountRepository } from '@/repositories/account.repository'
import { BannerRepository } from '@/repositories/banner.repository'
import { CategoryRepository } from '@/repositories/category.repository'
import { ProfileRepository } from '@/repositories/profile.repository'
import { SessionRepository } from '@/repositories/session.repository'
import { UserRepository } from '@/repositories/user.repository'
import { VerificationRepository } from '@/repositories/verification.repository'
import { AuthService } from '@/services/auth.service'
import { BannerService } from '@/services/banner.service'
import { CategoryService } from '@/services/category.service'
import { SecurityService } from '@/services/security.service'

export const createTRPCContext = async (opts: {
  headers: Headers
}): Promise<TRPCContext> => {
  const session = await validateAccessToken(opts.headers)

  const accountRepo = new AccountRepository(db, orm, schema)
  const bannerRepo = new BannerRepository(db, orm, schema)
  const categoryRepo = new CategoryRepository(db, orm, schema)
  const profileRepo = new ProfileRepository(db, orm, schema)
  const sessionRepo = new SessionRepository(db, orm, schema)
  const userRepo = new UserRepository(db, orm, schema)
  const verificationRepo = new VerificationRepository(db, orm, schema)

  const auth = new AuthService(
    db,
    accountRepo,
    profileRepo,
    userRepo,
    verificationRepo,
  )
  const banner = new BannerService(db, bannerRepo)
  const category = new CategoryService(db, categoryRepo)
  const security = new SecurityService(db, accountRepo, sessionRepo, userRepo)

  return {
    headers: opts.headers,
    session,
    services: {
      address: undefined,
      auth,
      banner,
      cart: undefined,
      category,
      order: undefined,
      product: undefined,
      security,
      staff: undefined,
      ticket: undefined,
      user: undefined,
      productVariant: undefined,
      vendor: undefined,
      wishlist: undefined,
    },
  }
}
