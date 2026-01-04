import type * as Validators from '@yukinu/validators/general'

export interface IBannerService {
  all(input: Validators.AllBannersInput): Promise<Validators.AllBannersOutput>

  create(
    input: Validators.CreateBannerInput,
  ): Promise<Validators.CreateBannerOutput>

  delete(
    input: Validators.DeleteBannerInput,
  ): Promise<Validators.DeleteBannerOutput>
}
