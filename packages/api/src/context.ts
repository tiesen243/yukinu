import { auth } from '@yukinu/auth'
import { db } from '@yukinu/db'

import type { TRPCContext } from './trpc'
import { AccountRepository } from './repositories/account.repository'
import { ProfileRepository } from './repositories/profile.repository'
import { UserRepository } from './repositories/user.repository'
import { AuthService } from './services/auth.service'
import { UserService } from './services/user.service'

export const createTRPCContext = async (request: {
  headers: Headers
}): Promise<TRPCContext> => {
  const headers = request.headers
  const session = await auth(request)

  const accountRepo = new AccountRepository(db)
  const profileRepo = new ProfileRepository(db)
  const userRepo = new UserRepository(db)

  const authService = new AuthService(db, accountRepo, userRepo)
  const userService = new UserService(db, profileRepo, userRepo)

  console.log(
    '[tRPC] >>> Request from',
    headers.get('x-trpc-source') ?? 'unknown',
    'by',
    session.user?.id ?? 'guest',
  )

  return {
    headers,
    session,

    authService,
    userService,
  }
}
