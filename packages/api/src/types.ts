import type { IAddressService } from '@/contracts/services/address.service'
import type { IAuthService } from '@/contracts/services/auth.service'
import type { IBannerService } from '@/contracts/services/banner.service'
import type { ICartService } from '@/contracts/services/cart.service'
import type { ICategoryService } from '@/contracts/services/category.service'
import type { IOrderService } from '@/contracts/services/order.service'
import type { IProductVariantService } from '@/contracts/services/product-variant.service'
import type { IProductService } from '@/contracts/services/product.service'
import type { ISecurityService } from '@/contracts/services/security.service'
import type { IStaffService } from '@/contracts/services/staff.service'
import type { ITicketService } from '@/contracts/services/ticket.service'
import type { IUserService } from '@/contracts/services/user.service'
import type { IVendorService } from '@/contracts/services/vendor.service'
import type { IWishlistService } from '@/contracts/services/wishlist.service'
import type { Role } from '@yukinu/validators/auth'

export interface TRPCMeta {
  message?: string
  role?: Role[]
}

export interface TRPCContext {
  headers: Headers
  session: { userId: string; role: Role } | null
  services: {
    address: IAddressService
    auth: IAuthService
    banner: IBannerService
    cart: ICartService
    category: ICategoryService
    order: IOrderService
    product: IProductService
    security: ISecurityService
    staff: IStaffService
    ticket: ITicketService
    user: IUserService
    productVariant: IProductVariantService
    vendor: IVendorService
    wishlist: IWishlistService
  }
}
