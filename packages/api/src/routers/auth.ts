import { AuthModel } from '@yukinu/validators/auth'

import { AuthService } from '../services/auth.service'
import {
  createTRPCMiddleware,
  createTRPCRouter,
  publicProcedure,
} from '../trpc'

const authRegister = createTRPCMiddleware(({ ctx, next }) => {
  const authService = new AuthService(ctx.db)
  return next({ ctx: { ...ctx, authService } })
})

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .use(authRegister)
    .input(AuthModel.registerBody)
    .mutation(({ input, ctx: { authService } }) => authService.register(input)),
})
