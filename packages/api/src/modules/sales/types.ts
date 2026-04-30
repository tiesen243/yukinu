import type { AllBannersUseCase } from '@/modules/sales/application/use-cases/banner/all-banners.use-case'
import type { CreateBannerUseCase } from '@/modules/sales/application/use-cases/banner/create-banner.use-case'
import type { DeleteBannerUseCase } from '@/modules/sales/application/use-cases/banner/delete-banner.use-case'
import type { AllVouchersUseCase } from '@/modules/sales/application/use-cases/voucher/all-vouchers.use-case'
import type { DeleteVoucherUseCase } from '@/modules/sales/application/use-cases/voucher/delete-voucher.use-case'
import type { OneVoucherUseCase } from '@/modules/sales/application/use-cases/voucher/one-voucher.use-case'
import type { SaveVoucherUseCase } from '@/modules/sales/application/use-cases/voucher/save-voucher.use-case'

export interface UseCases {
  banner: {
    all: AllBannersUseCase
    create: CreateBannerUseCase
    delete: DeleteBannerUseCase
  }
  voucher: {
    all: AllVouchersUseCase
    delete: DeleteVoucherUseCase
    one: OneVoucherUseCase
    save: SaveVoucherUseCase
  }
}
