import type * as Validators from '@yukinu/validators/general'

export interface ITicketService {
  all(input: Validators.AllTicketsInput): Promise<Validators.AllTicketsOutput>

  one(input: Validators.OneTicketInput): Promise<Validators.OneTicketOutput>

  create(
    input: Validators.CreateTicketInput,
  ): Promise<Validators.CreateTicketOutput>

  updateStatus(
    input: Validators.UpdateTicketStatusInput,
  ): Promise<Validators.UpdateTicketStatusOutput>
}
