import { UserModel } from '@yukinu/validators/user'

import { adminProcedure, createTRPCRouter, protectedProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  getUsers: adminProcedure
    .input(UserModel.findUsersBySearchWithPaginationQuery)
    .query(({ ctx: { services }, input }) => services.user.getUsers(input)),

  getInfo: protectedProcedure.query(({ ctx: { services, session } }) =>
    services.user.getUserInfo(session.user),
  ),

  updateRole: adminProcedure
    .input(UserModel.updateUserRoleBody)
    .mutation(({ ctx: { services }, input }) =>
      services.user.updateUserRole(input),
    ),

  updateInfo: protectedProcedure
    .input(UserModel.updateProfileBody)
    .mutation(({ ctx: { services, session }, input }) =>
      services.user.updateUserInfo(session.user.id, input),
    ),
})
