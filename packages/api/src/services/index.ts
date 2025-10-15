import { AccountRepository } from '../repositories/account.repository'
import { ProfileRepository } from '../repositories/profile.repository'
import { UserRepository } from '../repositories/user.repository'
import { createTRPCMiddleware } from '../trpc'
import { AuthService } from './auth.service'

export const assignServices = createTRPCMiddleware(({ ctx: { db }, next }) => {
  const accountRepo = new AccountRepository(db)
  const profileRepo = new ProfileRepository(db)
  const userRepo = new UserRepository(db)

  const authService = new AuthService(db, accountRepo, profileRepo, userRepo)

  return next({
    ctx: {
      authService,
    },
  })
})
