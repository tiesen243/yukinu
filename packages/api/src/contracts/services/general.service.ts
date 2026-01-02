import type { GeneralValidators } from '@yukinu/validators/general'

export interface IGeneralService {
  allBanners(
    input: GeneralValidators.AllBannersInput,
  ): Promise<GeneralValidators.AllBannersOutput>

  createBanner(
    input: GeneralValidators.CreateBannerInput,
  ): Promise<GeneralValidators.CreateBannerOutput>

  deleteBanner(
    input: GeneralValidators.DeleteBannerInput,
  ): Promise<GeneralValidators.DeleteBannerOutput>

  allTickets(
    input: GeneralValidators.AllTicketsInput,
  ): Promise<GeneralValidators.AllTicketsOutput>

  oneTicket(
    input: GeneralValidators.OneTicketInput,
  ): Promise<GeneralValidators.OneTicketOutput>

  createTicket(
    input: GeneralValidators.CreateTicketInput,
  ): Promise<GeneralValidators.CreateTicketOutput>

  updateTicketStatus(
    input: GeneralValidators.UpdateTicketStatusInput,
  ): Promise<GeneralValidators.UpdateTicketStatusOutput>
}
