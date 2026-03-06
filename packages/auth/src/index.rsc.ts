import { cache } from 'react'

import { authOptions } from '@/config'
import { Auth } from '@/core'

const {
  auth: uncachedAuth,
  currentUser: uncachedCurrentUser,
  verifyAccessToken,

  signIn,
  signOut,

  handlers,
} = Auth(authOptions)

/**
 * This is the main way to get session data for your RSCs.
 * This will de-duplicate all calls to auth's default `auth()` function and only call it once per request
 */
const auth = cache(uncachedAuth)
const currentUser = cache(uncachedCurrentUser)

export type { SessionWithUser, User } from '@/core/types'
export { Password } from '@/core/password'
export { auth, currentUser, verifyAccessToken, signIn, signOut, handlers }
