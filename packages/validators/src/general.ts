import * as z from 'zod'

export namespace GeneralValidators {
  export const ticketStatuses = ['open', 'resolved', 'closed'] as const
  export type TicketStatus = (typeof ticketStatuses)[number]

  export const banner = z.object({
    id: z.cuid(),
    url: z.url(),
  })
  export type Banner = z.infer<typeof banner>

  export const ticket = z.object({
    id: z.cuid(),
    userId: z.cuid(),
    subject: z
      .string()
      .min(1, 'Subject is required')
      .max(255, 'Subject is too long'),
    description: z.string().min(1),
    status: z.enum(ticketStatuses),
    createdAt: z.date(),
  })
  export type Ticket = z.infer<typeof ticket>

  export const allBannersInput = z.object()
  export type AllBannersInput = z.infer<typeof allBannersInput>
  export const allBannersOutput = z.array(banner)
  export type AllBannersOutput = z.infer<typeof allBannersOutput>

  export const createBannerInput = banner.omit({ id: true })
  export type CreateBannerInput = z.infer<typeof createBannerInput>
  export const createBannerOutput = banner.pick({ id: true })
  export type CreateBannerOutput = z.infer<typeof createBannerOutput>

  export const deleteBannerInput = z.object({ id: z.cuid() })
  export type DeleteBannerInput = z.infer<typeof deleteBannerInput>
  export const deleteBannerOutput = banner.pick({ id: true })
  export type DeleteBannerOutput = z.infer<typeof deleteBannerOutput>

  export const allTicketsInput = z.object({
    userId: z.cuid(),
    status: z.enum(ticketStatuses).optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  })
  export type AllTicketsInput = z.infer<typeof allTicketsInput>
  export const allTicketsOutput = z.object({
    tickets: z.array(ticket),
    pagination: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    }),
  })
  export type AllTicketsOutput = z.infer<typeof allTicketsOutput>

  export const oneTicketInput = z.object({ id: z.cuid() })
  export type OneTicketInput = z.infer<typeof oneTicketInput>
  export const oneTicketOutput = ticket
  export type OneTicketOutput = z.infer<typeof oneTicketOutput>

  export const createTicketInput = ticket.omit({
    id: true,
    status: true,
    createdAt: true,
  })
  export type CreateTicketInput = z.infer<typeof createTicketInput>
  export const createTicketOutput = ticket.pick({ id: true })
  export type CreateTicketOutput = z.infer<typeof createTicketOutput>

  export const updateTicketStatusInput = z.object({
    id: z.cuid(),
    status: z.enum(ticketStatuses),
  })
  export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusInput>
  export const updateTicketStatusOutput = ticket.pick({ id: true })
  export type UpdateTicketStatusOutput = z.infer<
    typeof updateTicketStatusOutput
  >
}
