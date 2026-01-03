import type { GeneralValidators } from '@yukinu/validators/general'

export interface ITicketService {
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
