import type { IGeneralService } from '@/contracts/services/general.service'
import type { GeneralValidators } from '@yukinu/validators/general'

import { TRPCError } from '@trpc/server'
import { utapi } from '@yukinu/uploadthing'

import { BaseService } from '@/services/base.service'

export class GeneralService extends BaseService implements IGeneralService {
  allBanners(
    _input: GeneralValidators.AllBannersInput,
  ): Promise<GeneralValidators.AllBannersOutput> {
    const { desc } = this._orm
    const { banners } = this._schema

    return this._db
      .select({ id: banners.id, url: banners.url })
      .from(banners)
      .orderBy(desc(banners.createdAt))
  }

  async createBanner(
    input: GeneralValidators.CreateBannerInput,
  ): Promise<GeneralValidators.CreateBannerOutput> {
    const { banners } = this._schema
    const { url } = input

    const [result] = await this._db
      .insert(banners)
      .values({ url })
      .returning({ id: banners.id })
    if (!result)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create banner',
      })

    return result
  }

  async deleteBanner(
    input: GeneralValidators.DeleteBannerInput,
  ): Promise<GeneralValidators.DeleteBannerOutput> {
    const { eq } = this._orm
    const { banners } = this._schema
    const { id } = input

    const [banner] = await this._db
      .select()
      .from(banners)
      .where(eq(banners.id, id))
      .limit(1)
    if (!banner)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Banner not found' })

    await this._db.delete(banners).where(eq(banners.id, id))
    await utapi.deleteFiles(banner.url.split('/').pop() ?? '')

    return { id }
  }

  allTickets(
    _input: GeneralValidators.AllTicketsInput,
  ): Promise<GeneralValidators.AllTicketsOutput> {
    throw new Error('Method not implemented.')
  }

  oneTicket(
    _input: GeneralValidators.OneTicketInput,
  ): Promise<GeneralValidators.OneTicketOutput> {
    throw new Error('Method not implemented.')
  }

  createTicket(
    _input: GeneralValidators.CreateTicketInput,
  ): Promise<GeneralValidators.CreateTicketOutput> {
    throw new Error('Method not implemented.')
  }

  updateTicketStatus(
    _input: GeneralValidators.UpdateTicketStatusInput,
  ): Promise<GeneralValidators.UpdateTicketStatusOutput> {
    throw new Error('Method not implemented.')
  }
}
