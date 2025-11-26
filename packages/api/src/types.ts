import type { Session } from '@yukinu/auth'
import type { UserModels } from '@yukinu/validators/user'

import type { IAddressService } from '@/contracts/services/address.service'
import type { IAuthService } from '@/contracts/services/auth.service'
import type { ICategoryService } from '@/contracts/services/category.service'
import type { IProductService } from '@/contracts/services/product.service'
import type { IProfileService } from '@/contracts/services/profile.service'
import type { IUserService } from '@/contracts/services/user.service'
import type { IVendorService } from '@/contracts/services/vendor.service'

export interface TRPCMeta {
  message?: string
  roles?: UserModels.Role[]
}

export interface TRPCContext {
  headers: Headers

  session: Omit<Session, 'token'> | null

  addressService: IAddressService
  authService: IAuthService
  categoryService: ICategoryService
  productService: IProductService
  profileService: IProfileService
  userService: IUserService
  vendorService: IVendorService
}

export type { AppRouter, RouterInputs, RouterOutputs } from '@/routers/_app'

export type { IAccountRepository } from '@/contracts/repositories/account.repository'
export type { IAddressRepository } from '@/contracts/repositories/address.repository'
export type { IBaseRepository } from '@/contracts/repositories/base.repository'
export type { ICategoryRepository } from '@/contracts/repositories/category.repository'
export type { IProductRepository } from '@/contracts/repositories/product.repository'
export type { IProfileRepository } from '@/contracts/repositories/profile.repository'
export type { IUserRepository } from '@/contracts/repositories/user.repository'
export type { IVendorRepository } from '@/contracts/repositories/vendor.repository'
