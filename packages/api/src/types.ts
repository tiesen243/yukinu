import type { IAuthService } from '@/contracts/services/auth.service'
import type { ICategoryService } from '@/contracts/services/category.service'
import type { IOrderService } from '@/contracts/services/order.service'
import type { IProductService } from '@/contracts/services/product.service'
import type { IUserService } from '@/contracts/services/user.service'
import type { IVendorService } from '@/contracts/services/vendor.service'
import type { UserValidators } from '@yukinu/validators/user'

export interface TRPCMeta {
  message?: string
  role?: UserValidators.Role[]
}

export interface TRPCContext {
  req: Request
  session: { userId: string; role: UserValidators.Role } | null
  services: {
    auth: IAuthService
    category: ICategoryService
    order: IOrderService
    product: IProductService
    user: IUserService
    vendor: IVendorService
  }
}
