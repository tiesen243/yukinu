import { authOptions } from '@/config'
import { Auth } from '@/core'

export type { SessionWithUser, User } from '@/core/types'
export { Password } from '@/core/password'
export const {
  auth,
  currentUser,

  createSession,
  verifyAccessToken,
  serializeTokenCookie,

  signIn,
  signOut,

  handlers,
} = Auth(authOptions)
