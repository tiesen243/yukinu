import type { TRPCRouterRecord } from '@trpc/server'
import type { Database } from '@yukinu/db/drizzle'

import type { UseCases } from '@/modules/sales/types'

import type { VendorMiddleware } from '@/modules/merchant/interfaces/vendor.middleware'
import { AllBannersUseCase } from '@/modules/sales/application/use-cases/banner/all-banners.use-case'
import { CreateBannerUseCase } from '@/modules/sales/application/use-cases/banner/create-banner.use-case'
import { DeleteBannerUseCase } from '@/modules/sales/application/use-cases/banner/delete-banner.use-case'
import { GetCartUseCase } from '@/modules/sales/application/use-cases/cart/get-cart.use-case'
import { RemoveCartItemUseCase } from '@/modules/sales/application/use-cases/cart/remove-item.dto'
import { SaveCartItemUseCase } from '@/modules/sales/application/use-cases/cart/save-cart-item.dto'
import { AnalyticsUseCase } from '@/modules/sales/application/use-cases/statistics/analytics.use-case'
import { DashboardUseCase } from '@/modules/sales/application/use-cases/statistics/dashboard.use-case'
import { AllVouchersUseCase } from '@/modules/sales/application/use-cases/voucher/all-vouchers.use-case'
import { DeleteVoucherUseCase } from '@/modules/sales/application/use-cases/voucher/delete-voucher.use-case'
import { OneVoucherUseCase } from '@/modules/sales/application/use-cases/voucher/one-voucher.use-case'
import { SaveVoucherUseCase } from '@/modules/sales/application/use-cases/voucher/save-voucher.use-case'
import { GetWishlistUseCase } from '@/modules/sales/application/use-cases/wishlist/get-wishlist.dto'
import { ToggleWishlistUseCase } from '@/modules/sales/application/use-cases/wishlist/toggle-wishlist.dto'
import { DrizzleBannerRepository } from '@/modules/sales/infrastructures/drizzle/banner.repository'
import { DrizzleCartItemRepository } from '@/modules/sales/infrastructures/drizzle/cart-item.repository'
import { DrizzleVoucherRepository } from '@/modules/sales/infrastructures/drizzle/voucher.repository'
import { DrizzleWishlistItemRepository } from '@/modules/sales/infrastructures/drizzle/wishlist-item.repository'
import { bannerRouter } from '@/modules/sales/interfaces/banner.router'
import { cartRouter } from '@/modules/sales/interfaces/cart.router'
import { statisticsRouter } from '@/modules/sales/interfaces/statistics.router'
import { voucherRouter } from '@/modules/sales/interfaces/voucher.router'
import { wishlistRouter } from '@/modules/sales/interfaces/wishlist.router'

export const createSalesModule = (
  db: Database,
  deps: {
    vendorMiddleware: VendorMiddleware
  },
) => {
  const bannerRepo = new DrizzleBannerRepository(db)
  const cartItemRepo = new DrizzleCartItemRepository(db)
  const voucherRepo = new DrizzleVoucherRepository(db)
  const wishlistItemRepo = new DrizzleWishlistItemRepository(db)

  const useCases = {
    admin: {
      analytics: new AnalyticsUseCase(db),
      dashboard: new DashboardUseCase(db),
    },
    banner: {
      all: new AllBannersUseCase(db, bannerRepo),
      create: new CreateBannerUseCase(db, bannerRepo),
      delete: new DeleteBannerUseCase(db, bannerRepo),
    },
    cart: {
      get: new GetCartUseCase(db, cartItemRepo),
      save: new SaveCartItemUseCase(db, cartItemRepo),
      remove: new RemoveCartItemUseCase(db, cartItemRepo),
    },
    voucher: {
      all: new AllVouchersUseCase(db, voucherRepo),
      one: new OneVoucherUseCase(db, voucherRepo),
      save: new SaveVoucherUseCase(db, voucherRepo),
      delete: new DeleteVoucherUseCase(db, voucherRepo),
    },
    wishlist: {
      get: new GetWishlistUseCase(db, wishlistItemRepo),
      toggle: new ToggleWishlistUseCase(db, wishlistItemRepo),
    },
  } satisfies UseCases

  return {
    useCases,
    repos: {
      cartItemRepo,
      voucherRepo,
    },

    router: {
      statistics: statisticsRouter(useCases, {
        vendorMiddleware: deps.vendorMiddleware,
      }),
      banner: bannerRouter(useCases),
      cart: cartRouter(useCases),
      voucher: voucherRouter(useCases),
      wishlist: wishlistRouter(useCases),
    } satisfies TRPCRouterRecord,
  }
}
