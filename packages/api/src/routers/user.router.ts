import { UserModel } from '@yukinu/validators/user'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  getInfo: protectedProcedure.query(({ ctx: { services, session } }) =>
    services.user.getUserInfo(session.user),
  ),

  updateInfo: protectedProcedure
    .input(UserModel.updateProfileBody)
    .mutation(({ ctx: { services, session }, input }) =>
      services.user.updateUserInfo(session.user.id, input),
    ),
})
