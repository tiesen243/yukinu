import type { AllBannersUseCase } from '@/modules/sales/application/use-cases/banner/all-banners.use-case'
import type { CreateBannerUseCase } from '@/modules/sales/application/use-cases/banner/create-banner.use-case'
import type { DeleteBannerUseCase } from '@/modules/sales/application/use-cases/banner/delete-banner.use-case'
import type { GetCartUseCase } from '@/modules/sales/application/use-cases/cart/get-cart.use-case'
import type { RemoveCartItemUseCase } from '@/modules/sales/application/use-cases/cart/remove-item.dto'
import type { SaveCartItemUseCase } from '@/modules/sales/application/use-cases/cart/save-cart-item.dto'
import type { AllVouchersUseCase } from '@/modules/sales/application/use-cases/voucher/all-vouchers.use-case'
import type { DeleteVoucherUseCase } from '@/modules/sales/application/use-cases/voucher/delete-voucher.use-case'
import type { OneVoucherUseCase } from '@/modules/sales/application/use-cases/voucher/one-voucher.use-case'
import type { SaveVoucherUseCase } from '@/modules/sales/application/use-cases/voucher/save-voucher.use-case'
import type { GetWishlistUseCase } from '@/modules/sales/application/use-cases/wishlist/get-wishlist.dto'
import type { ToggleWishlistUseCase } from '@/modules/sales/application/use-cases/wishlist/toggle-wishlist.dto'

export interface UseCases {
  banner: {
    all: AllBannersUseCase
    create: CreateBannerUseCase
    delete: DeleteBannerUseCase
  }
  cart: {
    get: GetCartUseCase
    save: SaveCartItemUseCase
    remove: RemoveCartItemUseCase
  }
  voucher: {
    all: AllVouchersUseCase
    delete: DeleteVoucherUseCase
    one: OneVoucherUseCase
    save: SaveVoucherUseCase
  }
  wishlist: {
    get: GetWishlistUseCase
    toggle: ToggleWishlistUseCase
  }
}

// Banner DTOs
export { AllBannersDto } from '@/modules/sales/application/dtos/banner/all-banners.dto'
export { CreateBannerDto } from '@/modules/sales/application/dtos/banner/create-banner.dto'
export { DeleteBannerDto } from '@/modules/sales/application/dtos/banner/delete-banner.dto'

// Voucher DTOs
export { AllVouchersDto } from '@/modules/sales/application/dtos/voucher/all-vouchers.dto'
export { OneVoucherDto } from '@/modules/sales/application/dtos/voucher/one-voucher.dto'
export { SaveVoucherDto } from '@/modules/sales/application/dtos/voucher/save-voucher.dto'

// Wishlist DTOs
export { GetWishlistDto } from '@/modules/sales/application/dtos/wishlist/get-wishlist.dto'
export { ToggleWishlistDto } from '@/modules/sales/application/dtos/wishlist/toggle-wishlist.dto'

// Entities
export { BannerEntity } from '@/modules/sales/domain/entities/banner.entity'
export { CartItemEntity } from '@/modules/sales/domain/entities/cart-item.entity'
export { VoucherEntity } from '@/modules/sales/domain/entities/voucher.entity'
export { WishlistItemEntity } from '@/modules/sales/domain/entities/wishlist-item.entity'
