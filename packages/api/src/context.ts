import { auth, validateSessionToken } from '@yukinu/auth'
import { db } from '@yukinu/db'
import { profiles } from '@yukinu/db/schema/profile'
import { accounts, users } from '@yukinu/db/schema/user'

import { AccountRepository } from './repositories/account.repository'
import { ProfileRepository } from './repositories/profile.repository'
import { UserRepository } from './repositories/user.repository'
import { AuthService } from './services/auth.service'
import { UserService } from './services/user.service'

const isomorphicGetSession = async (headers: Headers) => {
  const authToken = headers.get('Authorization') ?? null
  if (authToken) return validateSessionToken(authToken)
  return auth({ headers } as Request)
}

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await isomorphicGetSession(opts.headers)

  const accountRepo = new AccountRepository(db, accounts)
  const profileRepo = new ProfileRepository(db, profiles)
  const userRepo = new UserRepository(db, users)

  const authService = new AuthService(db, accountRepo, profileRepo, userRepo)
  const userService = new UserService(db, profileRepo, userRepo)

  console.log(
    '>>> tRPC Request from',
    opts.headers.get('x-trpc-source') ?? 'unknown',
    'by',
    session?.user?.username ?? 'anonymous',
  )

  return {
    headers: opts.headers,
    session,
    services: {
      auth: authService,
      user: userService,
    },
  }
}

export type { AuthService, UserService }
export type { IAccountRepository } from './repositories/account'
export type { IProfileRepository } from './repositories/profile'
export type { IUserRepository } from './repositories/user'
