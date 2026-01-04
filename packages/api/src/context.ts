import type { TRPCContext } from '@/types'

import { validateAccessToken } from '@yukinu/auth'
import { db, orm } from '@yukinu/db'
import * as schema from '@yukinu/db/schema'

import { AccountRepository } from '@/repositories/account.repository'
import { AddressRepository } from '@/repositories/address.repository'
import { BannerRepository } from '@/repositories/banner.repository'
import { CategoryRepository } from '@/repositories/category.repository'
import { ProductImageRepository } from '@/repositories/product-image.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { ProfileRepository } from '@/repositories/profile.repository'
import { SessionRepository } from '@/repositories/session.repository'
import { TicketRepository } from '@/repositories/ticket.repository'
import { UserRepository } from '@/repositories/user.repository'
import { VariantRepository } from '@/repositories/variant.repository'
import { VendorRepository } from '@/repositories/vendor.repository'
import { VerificationRepository } from '@/repositories/verification.repository'
import { WishlistItemRepository } from '@/repositories/wishlist-item.repository'
import { AddressService } from '@/services/address.service'
import { AuthService } from '@/services/auth.service'
import { BannerService } from '@/services/banner.service'
import { CategoryService } from '@/services/category.service'
import { ProductVariantService } from '@/services/product-variant.service'
import { ProductService } from '@/services/product.service'
import { SecurityService } from '@/services/security.service'
import { TicketService } from '@/services/ticket.service'
import { UserService } from '@/services/user.service'
import { VendorStaffService } from '@/services/vendor-staff.service'
import { VendorService } from '@/services/vendor.service'
import { WishlistService } from '@/services/wishlist.service'

export const createTRPCContext = async (opts: {
  headers: Headers
}): Promise<TRPCContext> => {
  const session = await validateAccessToken(opts.headers)

  const accountRepo = new AccountRepository(db, orm, schema)
  const addressRepo = new AddressRepository(db, orm, schema)
  const bannerRepo = new BannerRepository(db, orm, schema)
  const categoryRepo = new CategoryRepository(db, orm, schema)
  const productImageRepo = new ProductImageRepository(db, orm, schema)
  const productRepo = new ProductRepository(db, orm, schema)
  const profileRepo = new ProfileRepository(db, orm, schema)
  const sessionRepo = new SessionRepository(db, orm, schema)
  const ticketRepo = new TicketRepository(db, orm, schema)
  const userRepo = new UserRepository(db, orm, schema)
  const variantRepo = new VariantRepository(db, orm, schema)
  const vendorRepo = new VendorRepository(db, orm, schema)
  const verificationRepo = new VerificationRepository(db, orm, schema)
  const wishlistItemRepo = new WishlistItemRepository(db, orm, schema)

  const address = new AddressService(db, addressRepo)
  const auth = new AuthService(
    db,
    accountRepo,
    profileRepo,
    userRepo,
    verificationRepo,
  )
  const banner = new BannerService(db, bannerRepo)
  const category = new CategoryService(db, categoryRepo)
  const productVariant = new ProductVariantService(db, productRepo, variantRepo)
  const product = new ProductService(
    db,
    categoryRepo,
    productImageRepo,
    productRepo,
    variantRepo,
    vendorRepo,
  )
  const security = new SecurityService(db, accountRepo, sessionRepo, userRepo)
  const ticket = new TicketService(db, ticketRepo)
  const user = new UserService(db, profileRepo, userRepo)
  const vendorStaff = new VendorStaffService(
    db,
    userRepo,
    vendorRepo,
    verificationRepo,
  )
  const vendor = new VendorService(db, vendorRepo, userRepo)
  const wishlist = new WishlistService(db, wishlistItemRepo)

  return {
    headers: opts.headers,
    session,
    services: {
      address,
      auth,
      banner,
      cart: undefined,
      category,
      order: undefined,
      productVariant,
      product,
      security,
      ticket,
      user,
      vendorStaff,
      vendor,
      wishlist,
    },
  }
}
