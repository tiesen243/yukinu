import { auth, validateSessionToken } from '@yukinu/auth'
import { db } from '@yukinu/db'
import { profiles } from '@yukinu/db/schema/profile'
import { accounts, users } from '@yukinu/db/schema/user'

import { AccountRepository } from './repositories/account.repository'
import { ProfileRepository } from './repositories/profile.repository'
import { UserRepository } from './repositories/user.repository'
import { AuthService } from './services/auth.service'

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

  console.log(
    '>>> tRPC Request from',
    opts.headers.get('x-trpc-source') ?? 'unknown',
    'by',
    session?.user?.username ?? 'anonymous',
  )

  return {
    db,
    session,
    services: {
      auth: authService,
    },
  }
}

export type { AuthService }
