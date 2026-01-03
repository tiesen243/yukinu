import type { GeneralValidators } from '@yukinu/validators/general'

export interface IBannerService {
  allBanners(
    input: GeneralValidators.AllBannersInput,
  ): Promise<GeneralValidators.AllBannersOutput>

  createBanner(
    input: GeneralValidators.CreateBannerInput,
  ): Promise<GeneralValidators.CreateBannerOutput>

  deleteBanner(
    input: GeneralValidators.DeleteBannerInput,
  ): Promise<GeneralValidators.DeleteBannerOutput>
}
