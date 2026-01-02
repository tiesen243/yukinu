import type { IGeneralService } from '@/contracts/services/general.service'
import type { GeneralValidators } from '@yukinu/validators/general'

import { BaseService } from '@/services/base.service'

export class GeneralService extends BaseService implements IGeneralService {
  allBanners(
    _input: GeneralValidators.AllBannersInput,
  ): Promise<GeneralValidators.AllBannersOutput> {
    throw new Error('Method not implemented.')
  }
  createBanner(
    _input: GeneralValidators.CreateBannerInput,
  ): Promise<GeneralValidators.CreateBannerOutput> {
    throw new Error('Method not implemented.')
  }
  deleteBanner(
    _input: GeneralValidators.DeleteBannerInput,
  ): Promise<GeneralValidators.DeleteBannerOutput> {
    throw new Error('Method not implemented.')
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
