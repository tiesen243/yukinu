import { createTRPCRouter, publicProcedure } from '@/trpc'

export const webhookRouter = createTRPCRouter({
  healthcheck: publicProcedure
    .meta({ message: 'Webhook healthcheck successful.' })
    .query(() => ({ status: 'ok' })),

  sepay: publicProcedure
    .meta({ message: 'Sepay webhook received successfully.' })
    .query(() => ({ status: 'ok' })),
})
