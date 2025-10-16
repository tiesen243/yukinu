import { createTRPCRouter, protectedProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  getInfo: protectedProcedure.query(({ ctx: { services, session } }) =>
    services.user.getUserInfo(session.user.id),
  ),
})
