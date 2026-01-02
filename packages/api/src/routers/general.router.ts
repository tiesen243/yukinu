import { GeneralValidators } from '@yukinu/validators/general'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/trpc'

export const generalRouter = createTRPCRouter({
  allBanners: publicProcedure
    .meta({ message: 'All banners fetched successfully.' })
    .input(GeneralValidators.allBannersInput)
    .output(GeneralValidators.allBannersOutput)
    .query(({ ctx, input }) => ctx.services.general.allBanners(input)),

  createBanner: protectedProcedure
    .meta({
      message: 'Banner created successfully.',
      role: ['admin', 'moderator'],
    })
    .input(GeneralValidators.createBannerInput)
    .output(GeneralValidators.createBannerOutput)
    .mutation(({ ctx, input }) => ctx.services.general.createBanner(input)),

  deleteBanner: protectedProcedure
    .meta({
      message: 'Banner deleted successfully.',
      role: ['admin', 'moderator'],
    })
    .input(GeneralValidators.deleteBannerInput)
    .output(GeneralValidators.deleteBannerOutput)
    .mutation(({ ctx, input }) => ctx.services.general.deleteBanner(input)),

  allTickets: protectedProcedure
    .meta({
      message: 'All tickets fetched successfully.',
    })
    .input(GeneralValidators.allTicketsInput.omit({ userId: true }))
    .output(GeneralValidators.allTicketsOutput)
    .query(({ ctx, input }) =>
      ctx.services.general.allTickets({
        ...input,
        userId: ['admin', 'moderator'].includes(ctx.session.role)
          ? ''
          : ctx.session.userId,
      }),
    ),

  oneTicket: protectedProcedure
    .meta({
      message: 'Ticket fetched successfully.',
      role: ['admin', 'moderator'],
    })
    .input(GeneralValidators.oneTicketInput)
    .output(GeneralValidators.oneTicketOutput)
    .query(({ ctx, input }) => ctx.services.general.oneTicket(input)),

  createTicket: protectedProcedure
    .meta({ message: 'Ticket created successfully.' })
    .input(GeneralValidators.createTicketInput.omit({ userId: true }))
    .output(GeneralValidators.createTicketOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.general.createTicket({
        ...input,
        userId: ctx.session.userId,
      }),
    ),

  updateTicketStatus: protectedProcedure
    .meta({
      message: 'Ticket status updated successfully.',
      role: ['admin', 'moderator'],
    })
    .input(GeneralValidators.updateTicketStatusInput)
    .output(GeneralValidators.updateTicketStatusOutput)
    .mutation(({ ctx, input }) =>
      ctx.services.general.updateTicketStatus(input),
    ),
})
